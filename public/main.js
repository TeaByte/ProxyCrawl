const sources = {
    http: [
        "http://proxysearcher.sourceforge.net/Proxy%20List.php?type=http",
        "https://openproxy.space/list/http",
        "https://proxyspace.pro/http.txt",
        "https://rootjazz.com/proxies/proxies.txt",
        "https://spys.me/proxy.txt",
        "https://proxyhub.me/en/all-http-proxy-list.html",
        "https://proxy-tools.com/proxy/http",
        "https://www.proxy-list.download/api/v1/get?type=http",
        "https://www.proxyscan.io/download?type=http",
        "https://proxylist.geonode.com/api/proxy-list?limit=500&page=1&sort_by=lastChecked&sort_type=desc&protocols=https",
        "https://cdn.jsdelivr.net/gh/aslisk/proxyhttps/https.txt",
        "https://cdn.jsdelivr.net/gh/clarketm/proxy-list/proxy-list-raw.txt",
        // "https://cdn.jsdelivr.net/gh/hanwayTech/free-proxy-list/https.txt",
        "https://cdn.jsdelivr.net/gh/hendrikbgr/Free-Proxy-Repo/proxy_list.txt",
        "https://cdn.jsdelivr.net/gh/jetkai/proxy-list/online-proxies/txt/proxies-http.txt",
        "https://cdn.jsdelivr.net/gh/mertguvencli/http-proxy-list/proxy-list/data.txt",
        "https://cdn.jsdelivr.net/gh/mmpx12/proxy-list/https.txt",
        "https://cdn.jsdelivr.net/gh/roosterkid/openproxylist/HTTPS_RAW.txt",
        "https://cdn.jsdelivr.net/gh/saschazesiger/Free-Proxies/proxies/http.txt",
        "https://cdn.jsdelivr.net/gh/ShiftyTR/Proxy-List/https.txt",
        "https://cdn.jsdelivr.net/gh/sunny9577/proxy-scraper/proxies.txt"
    ],
    socks4: [
        'http://proxysearcher.sourceforge.net/Proxy%20List.php?type=socks', 
        'https://openproxy.space/list/socks4', 
        'https://proxyspace.pro/socks4.txt', 
        'https://www.proxy-list.download/api/v1/get?type=socks4', 
        'https://proxyhub.me/en/all-socks4-proxy-list.html', 
        'https://proxylist.geonode.com/api/proxy-list?limit…rt_by=lastChecked&sort_type=desc&protocols=socks4', 
        'https://www.my-proxy.com/free-socks-4-proxy.html', 
        'https://cdn.jsdelivr.net/gh/B4RC0DE-TM/proxy-list/SOCKS4.txt', 
        // 'https://cdn.jsdelivr.net/gh/hanwayTech/free-proxy-list/socks4.txt', 
        'https://cdn.jsdelivr.net/gh/jetkai/proxy-list/online-proxies/txt/proxies-socks4.txt', 
        'https://cdn.jsdelivr.net/gh/roosterkid/openproxylist/SOCKS4_RAW.txt', 
        'https://cdn.jsdelivr.net/gh/saschazesiger/Free-Proxies/proxies/socks4.txt', 
        'https://cdn.jsdelivr.net/gh/TheSpeedX/PROXY-List/socks4.txt'
    ],
    socks5: [
        'http://proxysearcher.sourceforge.net/Proxy%20List.php?type=socks', 
        'https://openproxy.space/list/socks5', 
        'https://proxyspace.pro/socks5.txt', 
        'https://www.proxy-list.download/api/v1/get?type=socks5', 
        'https://proxy-tools.com/proxy/socks5', 
        'https://proxyhub.me/en/all-sock5-proxy-list.html', 
        'https://proxylist.geonode.com/api/proxy-list?limit…rt_by=lastChecked&sort_type=desc&protocols=socks5', 
        // 'https://cdn.jsdelivr.net/gh/hanwayTech/free-proxy-list/socks5.txt', 
        'https://cdn.jsdelivr.net/gh/HyperBeats/proxy-list/socks5.txt', 
        'https://cdn.jsdelivr.net/gh/jetkai/proxy-list/online-proxies/txt/proxies-socks5.txt', 
        'https://cdn.jsdelivr.net/gh/mmpx12/proxy-list/socks5.txt', 
        'https://cdn.jsdelivr.net/gh/roosterkid/openproxylist/SOCKS5_RAW.txt', 
        'https://cdn.jsdelivr.net/gh/saschazesiger/Free-Proxies/proxies/socks5.txt', 
        'https://cdn.jsdelivr.net/gh/TheSpeedX/PROXY-List/socks5.txt'
    ]
}

let urls = [];
let results = [];

const proxyMatch = /(?:^|\D)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5})(?:\D|$)/g;
const isValidUrl = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

let proxyType = "http";
const counter = document.querySelector("#counter");
const textAreaInput = document.querySelector("#tAreaInput");
const textAreaOutput = document.querySelector("#tAreaOutput");
const tapButtons = document.querySelectorAll("#tapButton");
const downloadButton = document.querySelector("#downloadButton");


textAreaInput.value = sources.http.join("\n");
tapButtons.forEach((button) => {
    button.addEventListener("click", () => {
        textAreaInput.value = sources[button.value].join("\n");
        proxyType = button.value;
    });
});


const request = async (url, i = 0) => {

    const proxy = [
        '', // try without proxy first
        'https://corsproxy.io/?',
    ];

    try{
        const response = await fetch(proxy[i] + url);
        const data = await response.text();
        const cleanData = data.match(proxyMatch).map(item => item.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/)[0].trim());
        results.push(...cleanData);
        textAreaOutput.value += cleanData.join("\n");
        counter.textContent = results.length;
    }
    catch(e){
        if (i === proxy.length - 1) {
            return
        } else {
            return request(url, i + 1)
        }
    }   
};


downloadButton.addEventListener("click", async () => {
    results = [];
    textAreaOutput.parentNode.classList.remove('hidden');
    textAreaOutput.value = "";
    counter.textContent = "0";
    
    downloadButton.classList.add("loading");
    downloadButton.innerHTML = "Downloading...";
    console.log(proxyType);

    await Promise.all(sources[proxyType].map(async (url) => {
        await request(url);
    }));

    downloadButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>Download Again`;
    downloadButton.classList.remove('loading');
});


function downloadTextFile() {
    const blob = new Blob([results.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proxies-${proxyType}.txt`;
    link.click();
    URL.revokeObjectURL(url);
};
