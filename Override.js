const ruleProviderCommon = {
  "type": "http",
  "format": "text",
  "interval": 86400
};

// 策略组通用配置
const groupBaseOption = {
  "interval": 300,
  "url": "http://1.1.1.1/generate_204",
  "max-failed-times": 3,
};

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 覆盖通用配置
  config["mixed-port"] = "1708";
  config["tcp-concurrent"] = true;
  config["allow-lan"] = true;
  config["ipv6"] = false;
  config["log-level"] = "info";
  config["unified-delay"] = "true";
  config["find-process-mode"] = "strict";
  config["global-client-fingerprint"] = "chrome";

  // 覆盖 dns 配置
  config["dns"] = {
    "enable": true,
    "listen": "0.0.0.0:1053",
    "ipv6": false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": ["*", "+.lan", "+.local", "+.direct", "+.msftconnecttest.com", "+.msftncsi.com"],
    "nameserver": ["223.5.5.5", "119.29.29.29"]
  };

  // 覆盖 geodata 配置
  config["geodata-mode"] = true;
  config["geox-url"] = {
    "geoip": "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/geoip.dat",
    "geosite": "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    "mmdb": "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb",
    "asn": "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/GeoLite2-ASN.mmdb"
  };

  // 覆盖 sniffer 配置
  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "sniff": {
      "TLS": {
        "ports": ["443", "8443"]
      },
      "HTTP": {
        "ports": ["80", "8080-8880"],
        "override-destination": true
      },
      "QUIC": {
        "ports": ["443", "8443"]
      }
    }
  };

  // 覆盖 tun 配置
  config["tun"] = {
    "enable": true,
    "stack": "mixed",
    "dns-hijack": ["any:53"]
  };

  // 覆盖策略组
  config["proxy-groups"] = [
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Static.png",
      "include-all": true,
      "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置|机场|官网|TG|群",
      name: "手动选择",
      type: "select",
	  url: "http://www.gstatic.com/generate_204",
      proxies: [],
    },
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png",
      "include-all": true,
      "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置|机场|官网|TG|群",
      name: "自动选择",
      type: "url-test",
      interval: 300,
    },
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/HK.png",
      "include-all": true,
      filter: "(?i)香港|HK|Hong Kong|HongKong",
      name: "香港分组",
      type: "url-test",
      interval: 300,
    },
   
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/SG.png",
      "include-all": true,
      filter: "(?i)新加坡|Singapore|SG",
      name: "新加坡分组",
      type: "url-test",
      interval: 300,
    },
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/JP.png",
      "include-all": true,
      filter: "(?i)日本|Japan|JP",
      name: "日本分组",
      type: "url-test",
      interval: 300,
    },
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/KR.png",
      "include-all": true,
      filter: "(?i)韩国|Korea|KR",
      name: "韩国分组",
      type: "url-test",
      interval: 300,
    },
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/US.png",
      "include-all": true,
      filter: "(?i)美国|United States|UnitedStates|America|US",
      name: "美国分组",
      type: "url-test",
      interval: 300,
    },
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/UN.png",
      "include-all": true,
      "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置|机场|官网|TG|群|香港|HK|Hong Kong|HongKong|Taiwan|TW|新加坡|Singapore|SG|日本|Japan|JP|韩国|Korea|KR|美国|United States|UnitedStates|America|US",
      name: "其他地区",
      type: "select",
      interval: 300,
    },
    {
      icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/OpenAI.png",
      name: "AI",
      type: "select",
      proxies: ["DIRECT", "手动选择", "自动选择", "香港分组", "新加坡分组",  "日本分组", "韩国分组", "美国分组", "其他地区"],
    },
    {
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png",
      name: "Proxy",
      type: "select",
      proxies: ["DIRECT", "手动选择", "自动选择", "香港分组", "新加坡分组",  "日本分组", "韩国分组", "美国分组", "其他地区"],
    }
	  //,
    // {
    //   icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Direct.png",
    //   name: "Direct",
    //   type: "select",
    //   proxies: ["DIRECT"],
    // },
    // {
    //   icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png",
    //   name: "JP",
    //   type: "select",
    //   proxies: ["日本分组"],
    // },
       
   
    // {
    //   icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Global.png",
    //   "include-all": true,
    //   "exclude-filter": "(?i)GB|Traffic|Expire|Premium|频道|订阅|ISP|流量|到期|重置|机场|官网|TG|群",
    //   proxies: ["其他地区", "美国分组", "韩国分组", "日本分组", "新加坡分组", "香港分组", "自动选择", "手动选择", "DIRECT"],
    //   name: "GLOBAL",
    //   type: "select",
    // }
  ];
	// 规则组
  if (!config['rule-providers']) {
    config['rule-providers'] = {};
  }
  config["rule-providers"] = Object.assign(config["rule-providers"],

 {
    
    "AI": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://laiquziru.github.io/my/AI.list",
      "path": "./rules/AI.list"
    },
	 "LQZR": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://laiquziru.github.io/my/lqzr.list",
      "path": "./rules/lqzr.list"
    },
    "AD": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Reject.list",
      "path": "./rules/AD.list"
    },
    "Apple": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Apple.list",
      "path": "./rules/Apple.list"
    },
    "Google": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Google.list",
      "path": "./rules/Google.list"
    },
    "YouTube": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/YouTube.list",
      "path": "./rules/YouTube.list"
    },
    "Telegram": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Telegram.list",
      "path": "./rules/Telegram.list"
    },
    "Twitter": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Twitter.list",
      "path": "./rules/Twitter.list"
    },
    // "Steam": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Steam.list",
    //   "path": "./rules/Steam.list"
    // },
    // "Epic": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Epic.list",
    //   "path": "./rules/Epic.list"
    // },
    
    // "Emby": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Emby.list",
    //   "path": "./rules/Emby.list"
    // },
    // "Spotify": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Spotify.list",
    //   "path": "./rules/Spotify.list"
    // },
    // "Bahamut": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Bahamut.list",
    //   "path": "./rules/Bahamut.list"
    // },
    // "Netflix": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Netflix.list",
    //   "path": "./rules/Netflix.list"
    // },
    // "Disney": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Disney.list",
    //   "path": "./rules/Disney.list"
    // },
    // "PrimeVideo": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/PrimeVideo.list",
    //   "path": "./rules/PrimeVideo.list"
    // },
    // "HBO": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/HBO.list",
    //   "path": "./rules/HBO.list"
    // },
    // "OneDrive": {
    //   ...ruleProviderCommon,
    //   "behavior": "classical",
    //   "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/OneDrive.list",
    //   "path": "./rules/OneDrive.list"
    // },
    "Github": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Github.list",
      "path": "./rules/Github.list"
    },
    "Microsoft": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Microsoft.list",
      "path": "./rules/Microsoft.list"
    },
    "Lan": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/Lan.list",
      "path": "./rules/Lan.list"
    },
    "ProxyGFW": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/Clash/Rules/ProxyGFW.list",
      "path": "./rules/ProxyGFW.list"
    }
  });

  // 覆盖规则
  config["rules"] = [
    "RULE-SET,AD,REJECT",
    "RULE-SET,AI,AI",
    "RULE-SET,LQZR,Proxy",
    "RULE-SET,Apple,Proxy",
    "RULE-SET,YouTube,Proxy",
    "RULE-SET,Google,Proxy",
    "RULE-SET,Telegram,Proxy",
    "RULE-SET,Twitter,Proxy",
    "RULE-SET,ProxyGFW,Proxy",
    "GEOSITE,github,Proxy",
    "GEOSITE,microsoft,Proxy",
    "GEOSITE,gfw,Proxy",
    "GEOIP,private,DIRECT",
    "GEOIP,cn,DIRECT",
    "MATCH,Proxy"
  ];

  // 返回修改后的配置
  return config;
}
