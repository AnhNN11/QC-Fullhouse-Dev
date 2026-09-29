// Original DolphinX exercises. Server-only references and hidden tests.
import 'server-only';
import type { Problem } from './types';
import type { JudgeTest } from './grading';
export const expandedProblems: (Problem & { reference: string; tests: JudgeTest[] })[] = [
  {
    "id": 101,
    "slug": "store-profit",
    "title": "Lợi nhuận cửa hàng",
    "topic": "Mảng",
    "difficulty": "Dễ",
    "statement": "Viết solve(prices). Cho giá hàng theo ngày. Chỉ mua một lần rồi bán vào một ngày sau đó. Trả về lợi nhuận lớn nhất; không có lãi thì trả 0.",
    "constraints": [
      "0–10000 giá nguyên trong [0, 1000000]."
    ],
    "starterCode": "function solve(prices) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[7,1,5,3,6,4]",
    "exampleOutput": "5",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(prices) { let min=Infinity,best=0; for(const p of prices){best=Math.max(best,p-min);min=Math.min(min,p)} return best; }",
    "tests": [
      {
        "args": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 5,
        "sample": true
      },
      {
        "args": [
          []
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            5
          ]
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            5,
            4,
            2
          ]
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            2,
            2,
            2
          ]
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            1,
            9
          ]
        ],
        "expected": 8,
        "sample": false
      }
    ]
  },
  {
    "id": 102,
    "slug": "unique-character",
    "title": "Mã ký tự đầu tiên không lặp",
    "topic": "Chuỗi",
    "difficulty": "Dễ",
    "statement": "Viết solve(s). Trả về chỉ số ký tự đầu tiên xuất hiện đúng một lần trong chuỗi s; nếu không có, trả -1.",
    "constraints": [
      "s chỉ gồm a–z, độ dài 0–10000."
    ],
    "starterCode": "function solve(s) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "\"swiss\"",
    "exampleOutput": "1",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(s) { const m={};for(const c of s)m[c]=(m[c]||0)+1;for(let i=0;i<s.length;i++)if(m[s[i]]===1)return i;return -1; }",
    "tests": [
      {
        "args": [
          "swiss"
        ],
        "expected": 1,
        "sample": true
      },
      {
        "args": [
          ""
        ],
        "expected": -1,
        "sample": false
      },
      {
        "args": [
          "aabb"
        ],
        "expected": -1,
        "sample": false
      },
      {
        "args": [
          "a"
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          "aabbc"
        ],
        "expected": 4,
        "sample": false
      }
    ]
  },
  {
    "id": 103,
    "slug": "meeting-intervals",
    "title": "Gộp lịch phòng họp",
    "topic": "Sắp xếp",
    "difficulty": "Trung bình",
    "statement": "Viết solve(intervals). Mỗi khoảng [start,end] là thời gian bận. Gộp các khoảng giao nhau hoặc chạm đầu mút. Trả các khoảng theo start tăng dần.",
    "constraints": [
      "0–1000 khoảng; 0 <= start <= end <= 100000."
    ],
    "starterCode": "function solve(intervals) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[[1,3],[2,6],[8,10]]",
    "exampleOutput": "[[1,6],[8,10]]",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(intervals) { const out=[];for(const v of intervals.sort((a,b)=>a[0]-b[0])){const p=out[out.length-1];if(p&&v[0]<=p[1])p[1]=Math.max(p[1],v[1]);else out.push([...v]);}return out; }",
    "tests": [
      {
        "args": [
          [
            [
              1,
              3
            ],
            [
              2,
              6
            ],
            [
              8,
              10
            ]
          ]
        ],
        "expected": [
          [
            1,
            6
          ],
          [
            8,
            10
          ]
        ],
        "sample": true
      },
      {
        "args": [
          []
        ],
        "expected": [],
        "sample": false
      },
      {
        "args": [
          [
            [
              2,
              4
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": [
          [
            1,
            4
          ]
        ],
        "sample": false
      },
      {
        "args": [
          [
            [
              1,
              9
            ],
            [
              2,
              3
            ],
            [
              4,
              5
            ]
          ]
        ],
        "expected": [
          [
            1,
            9
          ]
        ],
        "sample": false
      },
      {
        "args": [
          [
            [
              0,
              0
            ]
          ]
        ],
        "expected": [
          [
            0,
            0
          ]
        ],
        "sample": false
      }
    ]
  },
  {
    "id": 104,
    "slug": "coin-counter",
    "title": "Đổi tiền tại quầy",
    "topic": "Quy hoạch động",
    "difficulty": "Trung bình",
    "statement": "Viết solve(coins, amount). Trả số đồng xu ít nhất để tạo đúng amount. Mỗi mệnh giá được dùng vô hạn. Không thể tạo thì trả -1; amount=0 trả 0.",
    "constraints": [
      "1–20 mệnh giá nguyên dương <=100; amount trong [0,1000]."
    ],
    "starterCode": "function solve(coins, amount) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[1,2,5], 11",
    "exampleOutput": "3",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(coins, amount) { const d=Array(amount+1).fill(Infinity);d[0]=0;for(let i=1;i<=amount;i++)for(const c of coins)if(c<=i)d[i]=Math.min(d[i],d[i-c]+1);return d[amount]===Infinity?-1:d[amount]; }",
    "tests": [
      {
        "args": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3,
        "sample": true
      },
      {
        "args": [
          [
            2
          ],
          3
        ],
        "expected": -1,
        "sample": false
      },
      {
        "args": [
          [
            2
          ],
          0
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            1
          ],
          7
        ],
        "expected": 7,
        "sample": false
      },
      {
        "args": [
          [
            3,
            4
          ],
          6
        ],
        "expected": 2,
        "sample": false
      }
    ]
  },
  {
    "id": 105,
    "slug": "warmer-days",
    "title": "Nhiệt độ ấm hơn",
    "topic": "Stack",
    "difficulty": "Trung bình",
    "statement": "Viết solve(temperatures). Với mỗi ngày, trả số ngày cần đợi để gặp nhiệt độ cao hơn hẳn. Không có ngày đó thì trả 0.",
    "constraints": [
      "0–10000 nhiệt độ nguyên trong [-50,60]."
    ],
    "starterCode": "function solve(temperatures) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[30,31,29,35]",
    "exampleOutput": "[1,2,1,0]",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(temperatures) { const out=Array(temperatures.length).fill(0),s=[];for(let i=0;i<temperatures.length;i++){while(s.length&&temperatures[i]>temperatures[s[s.length-1]]){const j=s.pop();out[j]=i-j;}s.push(i);}return out; }",
    "tests": [
      {
        "args": [
          [
            30,
            31,
            29,
            35
          ]
        ],
        "expected": [
          1,
          2,
          1,
          0
        ],
        "sample": true
      },
      {
        "args": [
          []
        ],
        "expected": [],
        "sample": false
      },
      {
        "args": [
          [
            4,
            4,
            4
          ]
        ],
        "expected": [
          0,
          0,
          0
        ],
        "sample": false
      },
      {
        "args": [
          [
            5,
            4,
            3
          ]
        ],
        "expected": [
          0,
          0,
          0
        ],
        "sample": false
      },
      {
        "args": [
          [
            -2,
            0,
            1
          ]
        ],
        "expected": [
          1,
          1,
          0
        ],
        "sample": false
      }
    ]
  },
  {
    "id": 106,
    "slug": "nearest-station",
    "title": "Trạm sóng gần nhất",
    "topic": "Tìm kiếm",
    "difficulty": "Dễ",
    "statement": "Viết solve(stations, target). stations đã tăng dần. Trả khoảng cách tuyệt đối nhỏ nhất từ target tới một trạm; mảng rỗng trả -1.",
    "constraints": [
      "0–10000 vị trí nguyên trong [-100000,100000]; target cùng miền."
    ],
    "starterCode": "function solve(stations, target) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[1,5,10], 7",
    "exampleOutput": "2",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(stations, target) { if(!stations.length)return -1;let l=0,r=stations.length;while(l<r){const m=(l+r)>>1;if(stations[m]<target)l=m+1;else r=m;}return Math.min(l<stations.length?Math.abs(stations[l]-target):Infinity,l?Math.abs(stations[l-1]-target):Infinity); }",
    "tests": [
      {
        "args": [
          [
            1,
            5,
            10
          ],
          7
        ],
        "expected": 2,
        "sample": true
      },
      {
        "args": [
          [],
          3
        ],
        "expected": -1,
        "sample": false
      },
      {
        "args": [
          [
            3
          ],
          3
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            -10,
            -2
          ],
          -8
        ],
        "expected": 2,
        "sample": false
      },
      {
        "args": [
          [
            2,
            8
          ],
          20
        ],
        "expected": 12,
        "sample": false
      }
    ]
  },
  {
    "id": 107,
    "slug": "order-window",
    "title": "Tổng đơn hàng liên tiếp",
    "topic": "Cửa sổ trượt",
    "difficulty": "Dễ",
    "statement": "Viết solve(orders, k). Trả tổng lớn nhất của đúng k ngày liên tiếp trong orders. Doanh thu có thể âm vì hoàn tiền.",
    "constraints": [
      "1 <= k <= orders.length <=10000; mỗi số trong [-10000,10000]."
    ],
    "starterCode": "function solve(orders, k) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[2,1,5,1,3], 3",
    "exampleOutput": "9",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(orders, k) { let sum=0;for(let i=0;i<k;i++)sum+=orders[i];let best=sum;for(let i=k;i<orders.length;i++){sum+=orders[i]-orders[i-k];best=Math.max(best,sum);}return best; }",
    "tests": [
      {
        "args": [
          [
            2,
            1,
            5,
            1,
            3
          ],
          3
        ],
        "expected": 9,
        "sample": true
      },
      {
        "args": [
          [
            -4,
            -2,
            -7
          ],
          2
        ],
        "expected": -6,
        "sample": false
      },
      {
        "args": [
          [
            5
          ],
          1
        ],
        "expected": 5,
        "sample": false
      },
      {
        "args": [
          [
            1,
            2,
            3
          ],
          3
        ],
        "expected": 6,
        "sample": false
      },
      {
        "args": [
          [
            0,
            0
          ],
          1
        ],
        "expected": 0,
        "sample": false
      }
    ]
  },
  {
    "id": 108,
    "slug": "robot-path",
    "title": "Đường đi của robot",
    "topic": "Đồ thị",
    "difficulty": "Trung bình",
    "statement": "Viết solve(grid). Robot đi từ góc trên trái tới góc dưới phải, mỗi bước lên/xuống/trái/phải. Ô 0 đi được, ô 1 bị chặn. Trả số bước ít nhất, hoặc -1 nếu không thể tới.",
    "constraints": [
      "Lưới chữ nhật 1–30 hàng và 1–30 cột, chỉ chứa 0/1."
    ],
    "starterCode": "function solve(grid) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[[0,0,1],[1,0,0],[0,0,0]]",
    "exampleOutput": "4",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(grid) { const h=grid.length,w=grid[0].length;if(grid[0][0]||grid[h-1][w-1])return -1;const q=[[0,0,0]],seen=new Set(['0,0']);for(let i=0;i<q.length;i++){const [r,c,d]=q[i];if(r===h-1&&c===w-1)return d;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=r+a,y=c+b,key=x+','+y;if(x>=0&&y>=0&&x<h&&y<w&&!grid[x][y]&&!seen.has(key)){seen.add(key);q.push([x,y,d+1]);}}}return -1; }",
    "tests": [
      {
        "args": [
          [
            [
              0,
              0,
              1
            ],
            [
              1,
              0,
              0
            ],
            [
              0,
              0,
              0
            ]
          ]
        ],
        "expected": 4,
        "sample": true
      },
      {
        "args": [
          [
            [
              0
            ]
          ]
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": -1,
        "sample": false
      },
      {
        "args": [
          [
            [
              0,
              1
            ],
            [
              1,
              0
            ]
          ]
        ],
        "expected": -1,
        "sample": false
      },
      {
        "args": [
          [
            [
              0,
              0,
              0
            ]
          ]
        ],
        "expected": 2,
        "sample": false
      }
    ]
  },
  {
    "id": 109,
    "slug": "parcel-trips",
    "title": "Ghép kiện hàng tối ưu",
    "topic": "Tham lam",
    "difficulty": "Trung bình",
    "statement": "Viết solve(weights, limit). Mỗi chuyến chở tối đa hai kiện và tổng trọng lượng không vượt limit. Trả số chuyến ít nhất để chở tất cả.",
    "constraints": [
      "0–1000 kiện; 1 <= weight <= limit <=10000."
    ],
    "starterCode": "function solve(weights, limit) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[3,2,2,1], 3",
    "exampleOutput": "3",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(weights, limit) { weights.sort((a,b)=>a-b);let i=0,j=weights.length-1,n=0;while(i<=j){if(weights[i]+weights[j]<=limit)i++;j--;n++;}return n; }",
    "tests": [
      {
        "args": [
          [
            3,
            2,
            2,
            1
          ],
          3
        ],
        "expected": 3,
        "sample": true
      },
      {
        "args": [
          [],
          3
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            2
          ],
          2
        ],
        "expected": 1,
        "sample": false
      },
      {
        "args": [
          [
            1,
            1,
            1,
            1
          ],
          2
        ],
        "expected": 2,
        "sample": false
      },
      {
        "args": [
          [
            3,
            3
          ],
          3
        ],
        "expected": 2,
        "sample": false
      }
    ]
  },
  {
    "id": 110,
    "slug": "warehouse-histogram",
    "title": "Diện tích kho trong biểu đồ",
    "topic": "Stack",
    "difficulty": "Khó",
    "statement": "Viết solve(heights). Mỗi cột có chiều rộng 1 và chiều cao heights[i]. Tìm diện tích hình chữ nhật lớn nhất nằm trọn dưới biểu đồ.",
    "constraints": [
      "0–10000 cột; chiều cao nguyên trong [0,10000]."
    ],
    "starterCode": "function solve(heights) {\n  // Viết lời giải tại đây\n}",
    "exampleInput": "[2,1,5,6,2,3]",
    "exampleOutput": "10",
    "explanation": "Truyền đầu vào theo thứ tự tham số của solve. Trả về kết quả, không dùng console.log.",
    "acceptance": "—",
    "status": "new",
    "reference": "function solve(heights) { const a=[...heights,0],s=[];let best=0;for(let i=0;i<a.length;i++){while(s.length&&a[s[s.length-1]]>a[i]){const h=a[s.pop()],left=s.length?s[s.length-1]:-1;best=Math.max(best,h*(i-left-1));}s.push(i);}return best; }",
    "tests": [
      {
        "args": [
          [
            2,
            1,
            5,
            6,
            2,
            3
          ]
        ],
        "expected": 10,
        "sample": true
      },
      {
        "args": [
          []
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            0,
            0
          ]
        ],
        "expected": 0,
        "sample": false
      },
      {
        "args": [
          [
            3,
            3,
            3
          ]
        ],
        "expected": 9,
        "sample": false
      },
      {
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": 6,
        "sample": false
      },
      {
        "args": [
          [
            4,
            3,
            2,
            1
          ]
        ],
        "expected": 6,
        "sample": false
      }
    ]
  }
];

