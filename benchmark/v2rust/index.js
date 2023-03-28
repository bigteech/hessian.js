"use strict";
/* eslint-disable no-undef */
const {
    build,
} = require("../dist/index");
const Benchmark = require("benchmark");
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const os = require('os');
const smaple = require('./sample');
const big = require('./big');

const { decode, encode } = require('hessian.js-1');

const classCache = new Map();
classCache.enableCompile = true;
const options = {
    classCache
};

const [decodeRust] = build({
    maxCacheLength: 1000,
    onCacheOverflow(len) {
        console.error('cache overflow:', len);
    }
});
const tasks = [
    {
        "2k": () => {
            const s = smaple(1);
            return {
                rust() {
                    decodeRust(s);
                },
                js() {
                    decode(s, '2.0', options);
                }
            };
        },
        "5k": () => {
            const s = smaple(10);
            return {
                rust() {
                    decodeRust(s);
                },
                js() {
                    decode(s, '2.0', options);
                }
            };
        },
        "30k": () => {
            const s = smaple(100);
            return {
                rust() {
                    decodeRust(s);
                },
                js() {
                    decode(s, '2.0', options);
                }
            };
        },
        "180k": () => {
            const s = smaple(500);
            return {
                rust() {
                    decodeRust(s);
                },
                js() {
                    decode(s, '2.0', options);
                }
            };
        },
        "ucdp 172k": () => {
            return {
                rust() {
                    decodeRust(big);
                },
                js() {
                    decode(big, '2.0', options);
                }
            };
        },
        "latin1 string 2kb": () => {
            const s = encode(new Array(200).fill("hello,@!#$%").join(''), '2.0');
            return {
                rust() {
                    decodeRust(s);
                },
                js() {
                    decode(s, '2.0', options);
                }
            };
        },
        "ucs2 string 2kb": () => {
            const s = encode(new Array(200).fill("hello,你好!").join(''), '2.0');
            return {
                rust() {
                    decodeRust(s);
                },
                js() {
                    decode(s, '2.0', options);
                }
            };
        }
    }
];

const template = (d1) => `
<html>
<head>
<script src="https://gw.alipayobjects.com/os/lib/antv/g2/4.2.8/dist/g2.min.js"></script>
</head>
<body>
<div style="display:flex">
<div style="width:800px;height:500px" id="deserializecontainer">deserializecontainer</div>
</div>
<script>
function render(data, container) {
    const Chart = G2.Chart;

    // 默认已经加载 legend-active 交互
    
    const chart = new Chart({
      container,
      autoFit: true,
    });
    
    chart.data(data);
    
    chart.scale('value', { nice: true, });
    
    chart.legend({
      position: 'top'
    });
    
    chart
      .interval()
      .position('type*value').color('impl', ['rgb(59, 106, 174)', '#2194ff'])
      .adjust([{
        type: 'dodge',
        marginRatio: 0
      }]);
    
    chart.render();
}
render(${JSON.stringify(d1)}, "deserializecontainer");
</script>
</body>
</html>
`;
const run = () => {
    const result = [];
    const suite = new Benchmark.Suite();
    tasks.forEach(x => {
        Object.entries(x).forEach(([y, z]) => {
            const { js, rust } = z();
            suite
                .add(`js:${y}`, js)
                .add(`rust:${y}`, rust);
        });
    });

    suite
        .on("cycle", function (event) {
            const { name, hz } = event.target;
            const [impl, ...realName] = name.split(':');
            const type = realName.join('');
            result.push({
                impl,
                type,
                count: Math.ceil(hz)
            });
        })
        .run();
    result.forEach(x => {
        if (x.impl === 'js') {
            const rust = result.find(y => y.type === x.type && y.impl === 'rust');
            rust.value = rust.count / x.count;
            x.value = 1;
        }
    });
    //  print table
    const log = (data) => {
        const result = {};
        data.forEach(({ type, impl, count }) => {
            if (!result[type]) {
                result[type] = {};
            }
            result[type][impl] = `${count} ops/sec`;
        });
        console.table(result);
    };
    log(result);

    //  write html
    const target = path.join(os.tmpdir(), 'hessian_benchmark.html');
    fs.writeFileSync(target, template(result));
    child_process.exec(`open ${target}`);
};
run();