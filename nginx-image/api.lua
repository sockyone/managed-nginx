function strSplit(delim,str)
    local t = {}

    for substr in string.gmatch(str, "[^".. delim.. "]*") do
        if substr ~= nil and string.len(substr) > 0 then
            table.insert(t,substr)
        end
    end

    return t
end

-- Required for ngx.req.get_body_data()
ngx.req.read_body();
local cjson = require("cjson")
local reqPath = ngx.var.uri:gsub("api/", "");
local reqMethod = ngx.var.request_method
local body = ngx.req.get_body_data() ==
        nil and {} or cjson.decode(ngx.req.get_body_data());

Api = {}
Api.__index = Api
Api.responded = false;
function Api.endpoint(method, path, callback)
    if Api.responded == false then
        if reqPath ~= path
        then
            return false
        end
        if reqMethod ~= method
        then
            -- ngx.status = 403
            -- return ngx.say("Method " .. reqMethod .. " not allowed")
            return false
        end

        Api.responded = true
        return callback(body)
    end

    return false;
end

-- Api.endpoint('GET', '/private/get',
--     function(body)
--         return ngx.say(
--             cjson.encode(
--                 {
--                     method=method,
--                     path=path,
--                     body=body
--                 }
--             )
--         );
--     end
-- )

-- dofile("/etc/openresty/luascripts/config.lua")
local config_manager = require("config")

Api.endpoint('POST', '/private/config',
    function(body)
        config_manager.update_to_config(body)

        return ngx.say("OK")
    end
)

Api.endpoint('GET', '/private/config',
    function (body)
        return ngx.say(
            cjson.encode(
                config_manager.get_all_config()
            )
        )
    end
)

Api.endpoint('POST', '/private/bulk_update_mapping',
    function (body)
        config_manager.bulk_update_mapping(body)
        return ngx.say("OK")
    end
)

Api.endpoint('POST', '/private/mapping',
    function (body)
        config_manager.set_mapping(body)
        return ngx.say("OK")
    end
)

Api.endpoint('DELETE', '/private/mapping',
    function (body)
        config_manager.remove_mapping(body)
        return ngx.say("OK")
    end
)


-- Api.endpoint('GET', '/private/test',
--     function(body)
--         return ngx.say(
--             cjson.encode(
--                 {
--                     method=method,
--                     path=path,
--                     body=array
--                 }
--             )
--         );
--     end
-- )


if Api.responded == false then
    ngx.status = 404
    return ngx.say("Path " .. reqPath .. " not found")
end

