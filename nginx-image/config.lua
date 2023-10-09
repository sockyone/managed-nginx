--[[

Declare config variables:
    under_attack_mode
    blacklist_ips
    whitelist_ips
]]

local cjson = require("cjson")

local config_fields = {
    "under_attack_mode",
    "blacklist_ips",
    "whitelist_ips"
}

local HASH_CONFIG_VALUE = 0

local function get_config_hash()
    return HASH_CONFIG_VALUE
end

local function get_all_config()
    local config = ngx.shared.config
    local result = {}

    for _, config_field in ipairs(config_fields) do
        result[config_field] = cjson.decode(config:get(config_field))
    end
    
    return result
end

local function update_to_config(new_config)
    local config = ngx.shared.config
    for _, config_field in ipairs(config_fields) do
        if new_config[config_field] ~= nil then
            config:set(config_field, cjson.encode(new_config[config_field]))
        end
    end
end

local function bulk_update_mapping(new_mapping)
    -- bulk mapping is array of json
    local mapping = ngx.shared.mapping
    for _, mapping_record in ipairs(new_mapping) do
        mapping:set(mapping_record["host"], cjson.encode(mapping_record["routes"]))
    end
end

local function set_mapping(mapping_record) 
    local mapping = ngx.shared.mapping
    mapping:set(mapping_record["host"], cjson.encode(mapping_record["routes"]))
end

local function remove_mapping(mapping_record)
    local mapping = ngx.shared.mapping
    mapping:delete(mapping_record["host"])
end



return {
    get_all_config = get_all_config,
    get_config_hash = get_config_hash,
    update_to_config = update_to_config,
    bulk_update_mapping = bulk_update_mapping,
    set_mapping = set_mapping,
    remove_mapping = remove_mapping
}