#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const config_file = process.argv[2]
const env_args = process.argv.splice(2)

if (config_file == undefined)
{
    console.log("error: config_file == undefined!")
    return
}

fs.readFile(config_file, (err, data) => {
    var config = data.toString();
    config = JSON.parse(config)
    
    if (Array.isArray(config)) {
        config.forEach((filename) => 
        {
            create_file(filename)
        })
    } else {
        for (const filename in config) {
            create_file(filename, config[filename].template, config[filename].dict)
        }
    }
})

function setup_args(str)
{
    return str.replace(/\{%(\d+)%\}/g, (m0, m1) => {
        if (env_args[m1] == undefined) {
            console.log("error: env_args[" + m1 + "] == undefined")
            process.exit(-1)
        }
        return env_args[m1]
    })
}

function setup_dict(str, filename, dict)
{
    return str.replace(/\{%(\w+)%\}/g, (m0, m1) => {
        if (dict[m1] == undefined) {
            console.log("error: " + filename + " dict[" + m1 + "] == undefined")
            process.exit(-1)
        }
        return dict[m1]
    })
}

function create_file(filename, template_filename, template_dict)
{
    if (fs.existsSync(filename)) {
        return;
    }
    setup_args(filename)
    if (filename[filename.length - 1] == '/') {
        // create directory
        fs.mkdir(filename, { recursive: true }, () => {
            console.log("create directory: " + filename)
        })
        return
    }
    
    // create file
    fs.mkdir(path.dirname(filename), { recursive: true }, () => {
        if (template_filename == undefined) {
            fs.open(filename, "w", () => {
                console.log("create file: " + filename)
            })
            return
        }
        fs.readFile(template_filename, (err, template_file_data) => {
            template_file_data = template_file_data.toString();
            template_file_data = setup_args(template_file_data)
            template_file_data = setup_dict(template_file_data, filename, template_dict)
            
            fs.writeFile(filename, template_file_data, () => {
                console.log("create file: " + filename + "      from template: " + template_filename)
            })
        })
    })
}

