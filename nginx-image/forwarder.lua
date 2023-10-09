local cjson = require("cjson")

local function startswith(str, match_pattern)
    return str:find('^' .. match_pattern) ~= nil
end

local function process_on_route(routes)
    for _, route in ipairs(routes) do
        -- ngx.log(ngx.STDERR, cjson.encode(route["path"]))
        if startswith(ngx.var.request_uri, route["path"]) then
            -- set headers
            -- ngx.status=200
            -- ngx.say(cjson.encode(route["header"]))
            -- return
            for _idx, header in ipairs(route["header"]) do
                ngx.req.set_header(header["key"], header["value"])
            end
            -- -- proxy_pass
            ngx.var.target = route["proxy_pass"]
            return
        end
    end

    ngx.status = 404
    ngx.say(json.encode(routes))
end

local function exec()
    -- ngx.status = 200
    -- ngx.say("HIIII")
    local mapping = ngx.shared.mapping
    local routes = mapping:get(ngx.var.host)
    if routes == nil then
        -- check if there is route *
        routes = mapping:get("*")
        if routes == nil then
            ngx.status = 404
            ngx.say("Not found")
        else
            process_on_route(cjson.decode(routes))
        end
    else
        process_on_route(cjson.decode(routes))
    end
end

FORWARDER = {
    exec = exec
}

-- return ngx.exit(ngx.HTTP_OK)

-- local cjson = require("cjson")

-- local function startswith(str, match_pattern) 
--     return str:find('^' .. match_pattern) ~= nil
-- end

-- local function process_on_route(routes)
--     for _, route_config in ipairs(routes) do
--         if startswith(ngx.var.request_uri, route["path"]) then
--             -- set headers
--             for _idx, header in ipairs(route["headers"]) do
--                 ngx.req.set_header(header["key"], header["value"])
--             end
--             -- proxy_pass
--             ngx.var.target = route["proxy_pass"]
--             return
--         end
--     end

--     ngx.status = 404
--     ngx.say("Not found")
-- end

-- local function exec()
--     ngx.status = 200
--     ngx.say("HIIII")
--     -- local mapping = ngx.shared.mapping
--     -- local routes = mapping:get(ngx.var.host)
--     -- if routes == nil then
--     --     -- check if there is route *
--     --     routes = mapping:get("*")
--     --     if routes == nil then
--     --         ngx.status = 404
--     --         ngx.say("Not found")
--     --     else
--     --         process_on_route(cjson.decode(routes))
--     --     end
--     -- else
--     --     process_on_route(cjson.decode(routes))
--     -- end
-- end

-- FORWARDER = {
--     exec = exec
-- }

-- -- return ngx.exit(ngx.HTTP_OK)