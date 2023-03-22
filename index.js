const http = require('http');
const fs = require('fs');
var requests = require('requests');
const htmlfile = fs.readFileSync("index.html","utf-8");
let ts = Date.now();
let date_time = new Date(ts);
const replaceVal = (tempval,originalval) => {
    temperature = tempval.replace("{%tempval%}", originalval.main.temp);
    temperature = temperature.replace("{%tempval_min%}", originalval.main.temp_min);
    temperature = temperature.replace("{%tempval_max%}", originalval.main.temp_max);
    temperature = temperature.replace("{%city_name%}", originalval.name);
    temperature = temperature.replace("{%country_name%}", originalval.sys.country);
    temperature = temperature.replace("{%Date%}",date_time.getDate());
    temperature = temperature.replace("{%Month%}",date_time.getMonth() + 1);
    temperature = temperature.replace("{%Year%}",date_time.getFullYear());
    return temperature;
}

const server = http.createServer((req,res) =>
{
    if(req.url == "/weatherapi")
    {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Nadiad&appid=31ce1f704337b3a6b7dbca193f8a8694')
            .on('data', function (chunk) {
                const Jsondata = JSON.parse(chunk);
                const arrData = [Jsondata];
                const realtimedata = arrData.map((val) => replaceVal(htmlfile,val)).join("")
                res.write(realtimedata);
                console.log(realtimedata);
                
        })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                console.log('end');
        });
    }
});

server.listen(80, "127.0.0.1");