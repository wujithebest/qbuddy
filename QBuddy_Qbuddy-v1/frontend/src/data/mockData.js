// QBuddy Demo Mock 数据
export const ROLES = [
  {
    id: 'chen',
    name: '小陈',
    avatar: '👨‍💻',
    grade: '大三建筑学专业',
    major: '建筑学',
    identity_type: 'college',
    bio: '埋头做设计的建筑狗，毕设和作品集是日常，DDL和投票经常淹没在闲聊里',
    painPoints: [
      '课程群消息太多，DDL和调课投票总是看不到',
      '手绘搭子好久没一起练了，关系在降温',
      '有个毕设闭关的朋友，不知道他答辩完了没'
    ]
  },
  {
    id: 'lin',
    name: '小林',
    avatar: '💼',
    grade: '入职1年·互联网产品经理',
    major: '产品经理',
    identity_type: 'young_worker',
    bio: '需求评审常驻选手、被开发催需求、PRD写不完、偶尔和开发battle、群消息太多经常漏看@',
    painPoints: [
      '工作群消息太多，被@但混在消息里看不到',
      'PRD改了无数版，和咖啡搭子好久没联系了',
      '前同事跳槽去大厂了，关系在变淡'
    ]
  },
  {
    id: 'zhou',
    name: '小周',
    avatar: '🎨',
    grade: '独立插画师·自由职业1年',
    major: '插画创作',
    identity_type: 'interest_focused',
    bio: '创造力旺盛、沉迷创作容易失联、社交圈子围绕兴趣展开、作息不规律',
    painPoints: [
      '经常深夜创作，画稿时消息全忽略',
      '频道里很活跃但私聊很慢，甲方催稿找不到人',
      '约的胶片冲扫一直拖着没去拿'
    ]
  }
];

export const GRAPH_DATA = {
  chen: {
    nodes: [
      { id: 'user', name: '小陈', type: 'user', group: 0 },
      { id: '手绘搭子小王', name: '小王', type: 'contact', group: 1, weight: 0.7 },
      { id: '毕设搭子小李', name: '小李', type: 'contact', group: 2, weight: 0.5 },
      { id: '室友小张', name: '小张', type: 'contact', group: 1, weight: 0.9 },
      { id: '助教小王', name: '助教小王', type: 'contact', group: 3, weight: 0.8 },
      { id: '导师刘老师', name: '刘老师', type: 'contact', group: 3, weight: 0.75 },
      { id: '同学小赵', name: '小赵', type: 'contact', group: 3, weight: 0.6 },
      { id: 'event_ddl', name: 'DDL: 建筑结构大作业', type: 'event', eventType: 'ddl', shape: 'rect' },
      { id: 'event_vote', name: '投票: 毕设展时间', type: 'event', eventType: 'vote', shape: 'rect' },
      { id: 'event_bishouji', name: '毕设中期答辩', type: 'event', eventType: 'signal', shape: 'diamond' }
    ],
    links: [
      { source: 'user', target: '手绘搭子小王', strength: 0.7, temp: 'cooling' },
      { source: 'user', target: '毕设搭子小李', strength: 0.5, temp: 'cold' },
      { source: 'user', target: '室友小张', strength: 0.9, temp: 'normal' },
      { source: 'user', target: '助教小王', strength: 0.8, temp: 'normal' },
      { source: 'user', target: '导师刘老师', strength: 0.75, temp: 'normal' },
      { source: 'user', target: '同学小赵', strength: 0.6, temp: 'normal' },
      { source: 'event_ddl', target: '助教小王', strength: 0.9, temp: 'hot' },
      { source: 'event_vote', target: '助教小王', strength: 0.8, temp: 'hot' },
      { source: 'event_bishouji', target: '毕设搭子小李', strength: 0.7, temp: 'normal' },
      { source: 'user', target: 'event_ddl', strength: 0.6, temp: 'normal' },
      { source: 'user', target: 'event_vote', strength: 0.5, temp: 'normal' }
    ]
  },
  lin: {
    nodes: [
      { id: 'user', name: '小林', type: 'user', group: 0 },
      { id: '动漫搭子小刚', name: '小刚', type: 'contact', group: 1, weight: 0.6 },
      { id: '羽毛球搭子小美', name: '小美', type: 'contact', group: 2, weight: 0.65 },
      { id: '老王', name: '老王', type: 'contact', group: 1, weight: 0.85 },
      { id: '闺蜜小雪', name: '小雪', type: 'contact', group: 1, weight: 0.9 },
      { id: '学生会学姐', name: '学姐', type: 'contact', group: 3, weight: 0.7 },
      { id: 'event_birthday', name: '生日: 老王', type: 'event', eventType: 'birthday', shape: 'rect' },
      { id: 'event_at', name: '@提及', type: 'event', eventType: 'at', shape: 'rect' }
    ],
    links: [
      { source: 'user', target: '动漫搭子小刚', strength: 0.6, temp: 'cooling' },
      { source: 'user', target: '羽毛球搭子小美', strength: 0.65, temp: 'cooling' },
      { source: 'user', target: '老王', strength: 0.85, temp: 'normal' },
      { source: 'user', target: '闺蜜小雪', strength: 0.9, temp: 'normal' },
      { source: 'user', target: '学生会学姐', strength: 0.7, temp: 'normal' },
      { source: 'event_birthday', target: '老王', strength: 0.9, temp: 'hot' },
      { source: 'event_at', target: '动漫搭子小刚', strength: 0.7, temp: 'normal' },
      { source: 'user', target: 'event_birthday', strength: 0.6, temp: 'normal' },
      { source: 'user', target: 'event_at', strength: 0.5, temp: 'normal' }
    ]
  },
  zhou: {
    nodes: [
      { id: 'user', name: '小周', type: 'user', group: 0 },
      { id: '阿杰', name: '阿杰', type: 'contact', group: 1, weight: 0.6 },
      { id: '室友小赵', name: '小赵', type: 'contact', group: 1, weight: 0.9 },
      { id: '学姐小陈', name: '学姐小陈', type: 'contact', group: 2, weight: 0.75 },
      { id: '吉他群学长', name: '学长A', type: 'contact', group: 3, weight: 0.7 },
      { id: '辅导员', name: '辅导员', type: 'contact', group: 3, weight: 0.85 },
      { id: 'event_channel', name: '频道: 吉他入门', type: 'event', eventType: 'channel', shape: 'rect' },
      { id: 'event_ddl', name: '新生见面会', type: 'event', eventType: 'ddl', shape: 'rect' }
    ],
    links: [
      { source: 'user', target: '阿杰', strength: 0.6, temp: 'cooling' },
      { source: 'user', target: '室友小赵', strength: 0.9, temp: 'normal' },
      { source: 'user', target: '学姐小陈', strength: 0.75, temp: 'normal' },
      { source: 'user', target: '吉他群学长', strength: 0.7, temp: 'normal' },
      { source: 'user', target: '辅导员', strength: 0.85, temp: 'normal' },
      { source: 'event_channel', target: '吉他群学长', strength: 0.8, temp: 'hot' },
      { source: 'event_ddl', target: '辅导员', strength: 0.9, temp: 'hot' },
      { source: 'user', target: 'event_channel', strength: 0.6, temp: 'normal' },
      { source: 'user', target: 'event_ddl', strength: 0.5, temp: 'normal' }
    ]
  }
};

export const CHAT_LISTS = {
  chen: [
    { id: 1, type: 'group', name: '建筑设计原理群 👥', avatar: '👥', lastMsg: '收到！', time: '刚刚', unread: 99, isGroup: true },
    { id: 2, type: 'group', name: '建筑力学课程群 👥', avatar: '👥', lastMsg: '大家记得预习', time: '刚刚', unread: 99, isGroup: true },
    { id: 3, type: 'group', name: '手绘打卡群 👥', avatar: '👥', lastMsg: '这个透视不太对吧', time: '10:30', unread: 12, isGroup: true },
    { id: 4, type: 'private', name: '手绘搭子小王 🎨', avatar: '🎨', lastMsg: '新买了支红环', time: '上周', unread: 0, isGroup: false, relationship: '搭子' },
    { id: 5, type: 'private', name: '毕设搭子小李 📐', avatar: '📐', lastMsg: '闭关中，勿扰', time: '上月', unread: 0, isGroup: false, relationship: '搭子' },
    { id: 6, type: 'private', name: '室友小张 👦', avatar: '👦', lastMsg: '帮我带杯咖啡呗', time: '10:30', unread: 2, isGroup: false, relationship: '室友' },
    { id: 7, type: 'group', name: '班级群 👥', avatar: '👥', lastMsg: '明天照常上课', time: '09:30', unread: 5, isGroup: true }
  ],
  lin: [
    { id: 1, type: 'group', name: '项目A产品群 👥', avatar: '👥', lastMsg: 'PRD第八版终于过了！', time: '刚刚', unread: 99, isGroup: true },
    { id: 2, type: 'group', name: '产品部群 👥', avatar: '👥', lastMsg: '剧本杀！想玩恐怖本', time: '10:05', unread: 15, isGroup: true },
    { id: 3, type: 'group', name: 'PM摸鱼群 👥', avatar: '👥', lastMsg: '周末骑行dd', time: '21:25', unread: 8, isGroup: true },
    { id: 4, type: 'group', name: '咖啡探店小分队 ☕', avatar: '☕', lastMsg: '下周还是这周六吗？', time: '14:00', unread: 1, isGroup: true },
    { id: 5, type: 'private', name: '咖啡搭子小刚 ☕', avatar: '☕', lastMsg: '下周探店约起', time: '上周', unread: 0, isGroup: false, relationship: '搭子' },
    { id: 6, type: 'private', name: '同事小雪 📊', avatar: '📊', lastMsg: '笑死哈哈哈哈', time: '刚刚', unread: 1, isGroup: false, relationship: '同事' },
    { id: 7, type: 'private', name: '前同事小美 🏢', avatar: '🏢', lastMsg: '新公司入职第一天！', time: '2天前', unread: 0, isGroup: false, relationship: '前同事' }
  ],
  zhou: [
    { id: 1, type: 'group', name: '创作者交流群 🎨', avatar: '🎨', lastMsg: '这期访谈真的很有启发', time: '22:30', unread: 20, isGroup: true },
    { id: 2, type: 'group', name: '胶片摄影群 📷', avatar: '📷', lastMsg: 'portra400终于出片了', time: '3小时前', unread: 12, isGroup: true },
    { id: 3, type: 'group', name: '插画师互助群 🖼️', avatar: '🖼️', lastMsg: '周日下午可以吗', time: '10:00', unread: 5, isGroup: true },
    { id: 4, type: 'group', name: '约稿沟通群-大艺 💼', avatar: '💼', lastMsg: '这个感觉对了！继续~', time: '15:30', unread: 1, isGroup: true },
    { id: 5, type: 'private', name: '编辑潇潇 📝', avatar: '📝', lastMsg: '稿子收到了 很好！', time: '昨天', unread: 0, isGroup: false, relationship: '编辑' },
    { id: 6, type: 'private', name: '甲方大艺 💼', avatar: '💼', lastMsg: '草稿我画了一部分了', time: '15:00', unread: 1, isGroup: false, relationship: '甲方' },
    { id: 7, type: 'private', name: '画廊小凡 🖼️', avatar: '🖼️', lastMsg: '作品集这周整理一下发你', time: '22:05', unread: 4, isGroup: false, relationship: '画廊策展人' }
  ]
};

// 三个角色的好友列表
export const CONTACT_LISTS = {
  chen: [
    { category: '特别关心', contacts: [
      { name: '爸爸 👨', avatar: '👨', relationship: '家人' },
      { name: '妈妈 👩', avatar: '👩', relationship: '家人' }
    ]},
    { category: '搭子', contacts: [
      { name: '手绘搭子小王 🎨', avatar: '🎨', relationship: '搭子' },
      { name: '毕设搭子小李 📐', avatar: '📐', relationship: '搭子' }
    ]},
    { category: '同学', contacts: [
      { name: '室友小张 👦', avatar: '👦', relationship: '室友' },
      { name: '小刘 🧑', avatar: '🧑', relationship: '同学' },
      { name: '顾芳 👩‍🔬', avatar: '👩‍🔬', relationship: '同学' }
    ]},
    { category: '好友', contacts: [
      { name: '老陈 🏀', avatar: '🏀', relationship: '好友' }
    ]}
  ],
  lin: [
    { category: '特别关心', contacts: [
      { name: '同事小雪 📊', avatar: '📊', relationship: '同事' },
      { name: '大学室友潇潇 📺', avatar: '📺', relationship: '室友' }
    ]},
    { category: '搭子', contacts: [
      { name: '咖啡搭子小刚 ☕', avatar: '☕', relationship: '搭子' },
      { name: '产品总监老王 🎯', avatar: '🎯', relationship: '领导' }
    ]},
    { category: '同事', contacts: [
      { name: '产品经理小范 💼', avatar: '💼', relationship: '同事' },
      { name: '高级PM小亮 🎯', avatar: '🎯', relationship: '前辈' },
      { name: 'UI设计师小鱼 🎨', avatar: '🎨', relationship: '协作' }
    ]},
    { category: '其他', contacts: [
      { name: '后端开发张工 💻', avatar: '💻', relationship: '协作' },
      { name: '前同事小美 🏢', avatar: '🏢', relationship: '前同事' }
    ]}
  ],
  zhou: [
    { category: '特别关心', contacts: [
      { name: '编辑潇潇 📝', avatar: '📝', relationship: '编辑' },
      { name: '甲方大艺 💼', avatar: '💼', relationship: '甲方' }
    ]},
    { category: '同好', contacts: [
      { name: '画友小涵 🎨', avatar: '🎨', relationship: '画友' },
      { name: '摄影婷婷 📷', avatar: '📷', relationship: '摄影圈' },
      { name: '独立音乐人阿琴 🎵', avatar: '🎵', relationship: '音乐' }
    ]},
    { category: '合作', contacts: [
      { name: '画廊策展小凡 🖼️', avatar: '🖼️', relationship: '策展' },
      { name: '手账浩子 📒', avatar: '📒', relationship: '同好' }
    ]},
    { category: '其他', contacts: [
      { name: '房东老王 🏠', avatar: '🏠', relationship: '房东' }
    ]}
  ]
};

export const CHAT_DETAILS = {
  chen: {
    1: {
      groupName: '建筑设计原理群',
      messages: [
        { id: 1, sender: '助教小王', type: 'text', content: '早啊大家 今天天气不错', time: '07:30' },
        { id: 2, sender: '小张', type: 'text', content: '是啊终于不下雨了', time: '07:31' },
        { id: 3, sender: '小李', type: 'text', content: '今天食堂有啥好吃的吗', time: '07:35' },
        { id: 4, sender: '小刘', type: 'text', content: '二楼新出了个炸鸡饭还不错', time: '07:36' },
        { id: 5, sender: '小赵', type: 'text', content: '真的吗 那我中午去试试', time: '07:37' },
        { id: 6, sender: '小冯', type: 'text', content: '1', time: '07:37' },
        { id: 7, sender: '小吴', type: 'text', content: '+1', time: '07:37' },
        { id: 8, sender: '助教小王', type: 'text', content: '绝了', time: '07:37' },
        { id: 9, sender: '小李', type: 'text', content: '笑不活了', time: '07:38' },
        { id: 10, sender: '小钱', type: 'text', content: '好家伙', time: '07:38' },
        { id: 11, sender: '小陈', type: 'text', content: '[表情包: 狗头]', time: '07:39' },
        { id: 12, sender: '小刘', type: 'text', content: '谁懂啊', time: '07:39' },
        { id: 13, sender: '小杨', type: 'text', content: '啥', time: '07:39' },
        { id: 14, sender: '小朱', type: 'text', content: '哈哈哈哈', time: '07:40' },
        { id: 15, sender: '小张', type: 'text', content: '赞', time: '07:40' },
        { id: 16, sender: '小赵', type: 'text', content: '666', time: '07:41' },
        { id: 17, sender: '小钱', type: 'text', content: '咋办', time: '07:41' },
        { id: 18, sender: '小刘', type: 'text', content: '可', time: '07:41' },
        { id: 19, sender: '小陈', type: 'text', content: '🔥', time: '07:42' },
        { id: 20, sender: '小吴', type: 'text', content: 'OK', time: '07:42' },
        { id: 21, sender: '小张', type: 'text', content: '太真实了', time: '07:43' },
        { id: 22, sender: '小周', type: 'text', content: '哈', time: '07:43' },
        { id: 23, sender: '小钱', type: 'text', content: '不是吧', time: '07:43' },
        { id: 24, sender: '小杨', type: 'text', content: '？？', time: '07:44' },
        { id: 25, sender: '小胡', type: 'text', content: '懂了', time: '07:44' },
        { id: 26, sender: '导师刘老师', type: 'text', content: '666', time: '07:45' },
        { id: 27, sender: '导师刘老师', type: 'text', content: '555', time: '07:45' },
        { id: 28, sender: '小赵', type: 'text', content: '哈哈哈哈', time: '07:45' },
        { id: 29, sender: '助教小王', type: 'text', content: '[图片]', time: '07:46' },
        { id: 30, sender: '小吴', type: 'text', content: '好的', time: '07:46' },
        { id: 31, sender: '小张', type: 'text', content: '谁懂啊', time: '07:47' },
        { id: 32, sender: '小胡', type: 'text', content: '？？', time: '07:47' },
        { id: 33, sender: '导师刘老师', type: 'text', content: 'tql', time: '07:47' },
        { id: 34, sender: '小杨', type: 'text', content: 'xswl', time: '07:48' },
        { id: 35, sender: '小钱', type: 'text', content: '好的', time: '07:48' },
        { id: 36, sender: '小张', type: 'text', content: '啊这', time: '07:49' },
        { id: 37, sender: '小郑', type: 'text', content: '冲', time: '07:49' },
        { id: 38, sender: '小杨', type: 'text', content: '好家伙', time: '07:49' },
        { id: 39, sender: '小张', type: 'text', content: '绝了', time: '07:50' },
        { id: 40, sender: '小朱', type: 'text', content: '笑不活了', time: '07:50' },
        { id: 41, sender: '小杨', type: 'text', content: 'tql', time: '07:51' },
        { id: 42, sender: '导师刘老师', type: 'text', content: '那个', time: '07:51' },
        { id: 43, sender: '小孙', type: 'text', content: '2', time: '07:51' },
        { id: 44, sender: '小李', type: 'text', content: '为啥', time: '07:52' },
        { id: 45, sender: '小胡', type: 'text', content: '啊', time: '07:52' },
        { id: 46, sender: '小胡', type: 'text', content: 'emmm', time: '07:53' },
        { id: 47, sender: '小吴', type: 'text', content: '嗯嗯嗯', time: '07:53' },
        { id: 48, sender: '小胡', type: 'text', content: '好的', time: '07:53' },
        { id: 49, sender: '小朱', type: 'text', content: '强', time: '07:54' },
        { id: 50, sender: '小李', type: 'text', content: 'srds', time: '07:54' },
        { id: 51, sender: '小周', type: 'text', content: '所以', time: '07:55' },
        { id: 52, sender: '小朱', type: 'text', content: '哈', time: '07:55' },
        { id: 53, sender: '小刘', type: 'text', content: 'awsl', time: '07:55' },
        { id: 54, sender: '小孙', type: 'text', content: '来了来了', time: '07:56' },
        { id: 55, sender: '助教小王', type: 'text', content: '【重要】建筑结构大作业DDL提前到5月6日中午12点！不是5月8日了！大家注意！', time: '08:00' },
        { id: 56, sender: '小张', type: 'text', content: '啊？？提前了？？我还没开始画图呢😭', time: '08:01' },
        { id: 57, sender: '小李', type: 'text', content: '救命 我的毕设还没做完又要赶大作业', time: '08:02' },
        { id: 58, sender: '小刘', type: 'text', content: '哈哈哈哈笑死 你怎么老赶ddl', time: '08:03' },
        { id: 59, sender: '小赵', type: 'text', content: '同问 我也还没动', time: '08:04' },
        { id: 60, sender: '小钱', type: 'text', content: 'xswl 你们真是一群ddl战士', time: '08:05' },
        { id: 61, sender: '小孙', type: 'text', content: '离谱 我以为还有两天', time: '08:06' },
        { id: 62, sender: '小周', type: 'text', content: '啊啊啊我也', time: '08:07' },
        { id: 63, sender: '小吴', type: 'text', content: '救命 怎么办', time: '08:08' },
        { id: 64, sender: '小郑', type: 'text', content: '有没有人一起来专教画图啊 我现在就过去', time: '08:10' },
        { id: 65, sender: '小冯', type: 'text', content: '+1 我也要去', time: '08:11' },
        { id: 66, sender: '小杨', type: 'text', content: '算我一个', time: '08:12' },
        { id: 67, sender: '小朱', type: 'text', content: '你们先走 我下课再去', time: '08:13' },
        { id: 68, sender: '小陈', type: 'text', content: '我也去 一起吗', time: '08:14' },
        { id: 69, sender: '小胡', type: 'text', content: '带我一个！', time: '08:15' },
        { id: 70, sender: '小刘', type: 'text', content: '[表情包: 狗头] 又要肝了', time: '08:16' },
        { id: 71, sender: '小郑', type: 'text', content: '牛', time: '08:16' },
        { id: 72, sender: '导师刘老师', type: 'text', content: 'awsl', time: '08:16' },
        { id: 73, sender: '小刘', type: 'text', content: '啥', time: '08:17' },
        { id: 74, sender: '小陈', type: 'text', content: '？？？', time: '08:17' },
        { id: 75, sender: '小孙', type: 'text', content: 'ok', time: '08:18' },
        { id: 76, sender: '小张', type: 'text', content: '+1', time: '08:18' },
        { id: 77, sender: '小刘', type: 'text', content: '[表情包: 笑哭]', time: '08:19' },
        { id: 78, sender: '小刘', type: 'text', content: '卧槽', time: '08:19' },
        { id: 79, sender: '导师刘老师', type: 'text', content: '[表情包: 狗头]', time: '08:20' },
        { id: 80, sender: '小胡', type: 'text', content: 'tql', time: '08:20' },
        { id: 81, sender: '小吴', type: 'text', content: '所以', time: '08:21' },
        { id: 82, sender: '小周', type: 'text', content: '啊', time: '08:21' },
        { id: 83, sender: '小胡', type: 'text', content: '离谱', time: '08:22' },
        { id: 84, sender: '小赵', type: 'text', content: '求', time: '08:22' },
        { id: 85, sender: '导师刘老师', type: 'text', content: '毕设中期答辩分组：@小陈 @小张 @小李 @小王 第四组，5月10日答辩', time: '09:00' },
        { id: 86, sender: '小张', type: 'text', content: '@小陈 我们毕设进展咋样了', time: '09:01' },
        { id: 87, sender: '小王', type: 'text', content: '我模型做完了 等渲染', time: '09:02' },
        { id: 88, sender: '小李', type: 'text', content: '我文本差不多了 就差排版了', time: '09:03' },
        { id: 89, sender: '小陈', type: 'text', content: '我分析图明天画 应该来得及', time: '09:05' },
        { id: 90, sender: '小张', type: 'text', content: '好的 那我们明天一起调？', time: '09:06' },
        { id: 91, sender: '小王', type: 'text', content: '可以 我下午有空', time: '09:07' },
        { id: 92, sender: '小李', type: 'text', content: '我也行', time: '09:08' },
        { id: 93, sender: '小孙', type: 'text', content: 'yyds', time: '09:08' },
        { id: 94, sender: '小钱', type: 'text', content: '有道理', time: '09:08' },
        { id: 95, sender: '导师刘老师', type: 'text', content: '呜呜', time: '09:08' },
        { id: 96, sender: '小孙', type: 'text', content: '好家伙', time: '09:08' },
        { id: 97, sender: '导师刘老师', type: 'text', content: '🔥', time: '09:09' },
        { id: 98, sender: '小周', type: 'text', content: '好的好的', time: '09:09' },
        { id: 99, sender: '小吴', type: 'text', content: '好家伙', time: '09:09' },
        { id: 100, sender: '助教小王', type: 'text', content: '【投票】毕设展时间：同意周三的扣1，同意周五的扣2', time: '10:00' },
        { id: 101, sender: '小赵', type: 'text', content: '1', time: '10:01' },
        { id: 102, sender: '小钱', type: 'text', content: '2', time: '10:01' },
        { id: 103, sender: '小孙', type: 'text', content: '1 1 1 周三好！', time: '10:02' },
        { id: 104, sender: '小周', type: 'text', content: '2吧 周五我要去实习', time: '10:03' },
        { id: 105, sender: '小吴', type: 'text', content: '1', time: '10:04' },
        { id: 106, sender: '小郑', type: 'text', content: '周二周三都行', time: '10:05' },
        { id: 107, sender: '小冯', type: 'text', content: '有道理', time: '10:06' },
        { id: 108, sender: '小陈', type: 'text', content: '无所谓都行', time: '10:07' },
        { id: 109, sender: '小杨', type: 'text', content: '哈哈哈哈哈', time: '10:08' },
        { id: 110, sender: '小赵', type: 'text', content: '笑死', time: '10:08' },
        { id: 111, sender: '小孙', type: 'text', content: '卧槽', time: '10:08' },
        { id: 112, sender: '小冯', type: 'text', content: '咋办', time: '10:09' },
        { id: 113, sender: '小周', type: 'text', content: '牛', time: '10:09' },
        { id: 114, sender: '导师刘老师', type: 'text', content: '哈', time: '10:10' },
        { id: 115, sender: '小刘', type: 'text', content: '卧槽', time: '10:10' },
        { id: 116, sender: '导师刘老师', type: 'text', content: 'bdjw', time: '10:11' },
        { id: 117, sender: '小李', type: 'text', content: '？？？', time: '10:11' },
        { id: 118, sender: '助教小王', type: 'text', content: '等等', time: '10:12' },
        { id: 119, sender: '小陈', type: 'text', content: '哈', time: '10:12' },
        { id: 120, sender: '小吴', type: 'text', content: 'OK', time: '10:13' },
        { id: 121, sender: '小孙', type: 'text', content: '太真实了', time: '10:13' },
        { id: 122, sender: '小李', type: 'text', content: '笑死', time: '10:14' },
        { id: 123, sender: '小钱', type: 'text', content: '我也觉得', time: '10:14' },
        { id: 124, sender: '导师刘老师', type: 'text', content: 'bdjw', time: '10:15' },
        { id: 125, sender: '小张', type: 'text', content: '哈哈哈哈', time: '10:15' },
        { id: 126, sender: '小周', type: 'text', content: '啥', time: '10:16' },
        { id: 127, sender: '小胡', type: 'text', content: '啊', time: '10:16' },
        { id: 128, sender: '小陈', type: 'text', content: '？？', time: '10:17' },
        { id: 129, sender: '助教小王', type: 'text', content: '谁懂啊', time: '10:17' }
      ]
    },
    2: {
      groupName: '建筑力学课程群',
      messages: [
        { id: 1, sender: '小王', type: 'text', content: '兄弟们 明天建筑力学课记得预习', time: '19:00' },
        { id: 2, sender: '小李', type: 'text', content: '预习啥啊 内容太多了', time: '19:01' },
        { id: 3, sender: '小赵', type: 'text', content: '同感 结构计算那块直接看懵了', time: '19:02' },
        { id: 4, sender: '小钱', type: 'text', content: '哈哈哈哈哈 死生有命', time: '19:03' },
        { id: 5, sender: '小孙', type: 'text', content: '你们卷王别凡尔赛了', time: '19:04' },
        { id: 6, sender: '小周', type: 'text', content: '啊这', time: '19:05' },
        { id: 7, sender: '小吴', type: 'text', content: '确实难', time: '19:06' },
        { id: 8, sender: '小陈', type: 'text', content: '结构力学那块确实难', time: '19:07' },
        { id: 9, sender: '小孙', type: 'text', content: '这', time: '19:07' },
        { id: 10, sender: '小赵', type: 'text', content: '😭', time: '19:07' },
        { id: 11, sender: '小陈', type: 'text', content: '[语音消息]', time: '19:07' },
        { id: 12, sender: '小王', type: 'text', content: '所以', time: '19:08' },
        { id: 13, sender: '小周', type: 'text', content: '收到', time: '19:08' },
        { id: 14, sender: '小陈', type: 'text', content: '干饭', time: '19:09' },
        { id: 15, sender: '小赵', type: 'text', content: '嗯嗯嗯', time: '19:09' },
        { id: 16, sender: '小陈', type: 'text', content: 'tql', time: '19:09' },
        { id: 17, sender: '小张', type: 'text', content: 'bdjw', time: '19:10' },
        { id: 18, sender: '小李', type: 'text', content: '[图片]', time: '19:10' },
        { id: 19, sender: '小冯', type: 'text', content: '这', time: '19:11' },
        { id: 20, sender: '小张', type: 'text', content: '[语音消息]', time: '19:11' },
        { id: 21, sender: '小周', type: 'text', content: '摆烂', time: '19:11' },
        { id: 22, sender: '小吴', type: 'text', content: '+1', time: '19:12' },
        { id: 23, sender: '小张', type: 'text', content: '强', time: '19:12' },
        { id: 24, sender: '小陈', type: 'text', content: '1', time: '19:13' },
        { id: 25, sender: '助教张老师', type: 'text', content: 'yyds', time: '19:13' },
        { id: 26, sender: '助教张老师', type: 'text', content: '[表情包: 哭]', time: '19:13' },
        { id: 27, sender: '小赵', type: 'text', content: '哈', time: '19:14' },
        { id: 28, sender: '助教张老师', type: 'text', content: '哈哈哈哈', time: '19:14' },
        { id: 29, sender: '小张', type: 'text', content: 'yyds', time: '19:15' },
        { id: 30, sender: '小李', type: 'text', content: '咋办', time: '19:15' },
        { id: 31, sender: '小王', type: 'text', content: '躺平', time: '19:15' },
        { id: 32, sender: '小周', type: 'text', content: '😭', time: '19:16' },
        { id: 33, sender: '小孙', type: 'text', content: '有道理', time: '19:16' },
        { id: 34, sender: '小周', type: 'text', content: '所以', time: '19:17' },
        { id: 35, sender: '小冯', type: 'text', content: '555', time: '19:17' },
        { id: 36, sender: '小钱', type: 'text', content: '+1', time: '19:17' },
        { id: 37, sender: '小钱', type: 'text', content: '🔥', time: '19:18' },
        { id: 38, sender: '小赵', type: 'text', content: '呜呜', time: '19:18' },
        { id: 39, sender: '小李', type: 'text', content: '有道理', time: '19:19' },
        { id: 40, sender: '助教张老师', type: 'text', content: '【重要】下周三之前提交力学分析报告，题目已发到课程群文件', time: '20:00' },
        { id: 41, sender: '小赵', type: 'text', content: '收到', time: '20:01' },
        { id: 42, sender: '小钱', type: 'text', content: '好的', time: '20:01' },
        { id: 43, sender: '小孙', type: 'text', content: '啊这 力学报告选题有哪些来着', time: '20:02' },
        { id: 44, sender: '小周', type: 'text', content: '文件里有 自己翻', time: '20:03' },
        { id: 45, sender: '小吴', type: 'text', content: '+1', time: '20:03' },
        { id: 46, sender: '小王', type: 'text', content: '好的谢谢', time: '20:04' },
        { id: 47, sender: '小陈', type: 'text', content: '我看了下 感觉第三个框架分析比较简单', time: '20:10' },
        { id: 48, sender: '小李', type: 'text', content: '哪个 那个高层结构抗震的？', time: '20:11' },
        { id: 49, sender: '小陈', type: 'text', content: '对 感觉计算量不大', time: '20:12' },
        { id: 50, sender: '小赵', type: 'text', content: '我想选第一个 那个拱结构', time: '20:13' },
        { id: 51, sender: '小钱', type: 'text', content: '那个计算量很大吧', time: '20:14' },
        { id: 52, sender: '小孙', type: 'text', content: '确实 而且挺复杂的', time: '20:15' },
        { id: 53, sender: '小王', type: 'text', content: '有没有人选第二个 截面设计的', time: '20:16' },
        { id: 54, sender: '小李', type: 'text', content: '我也在考虑那个', time: '20:17' },
        { id: 55, sender: '助教张老师', type: 'text', content: '提醒：题目三选一即可，核心是理解力学原理', time: '20:30' },
        { id: 56, sender: '小周', type: 'text', content: '收到老师', time: '20:31' },
        { id: 57, sender: '小吴', type: 'text', content: '好的', time: '20:32' },
        { id: 58, sender: '小陈', type: 'text', content: '那我就选三了 有没有人一起', time: '20:35' },
        { id: 59, sender: '小赵', type: 'text', content: '我选一 不跟你们卷', time: '20:36' },
        { id: 60, sender: '小钱', type: 'text', content: 'xswl', time: '20:37' },
        { id: 61, sender: '小冯', type: 'text', content: 'OK', time: '20:37' },
        { id: 62, sender: '小冯', type: 'text', content: '有道理', time: '20:37' },
        { id: 63, sender: '小郑', type: 'text', content: '嗯嗯嗯', time: '20:37' },
        { id: 64, sender: '小王', type: 'text', content: '所以', time: '20:37' },
        { id: 65, sender: '小冯', type: 'text', content: '不是吧', time: '20:38' },
        { id: 66, sender: '小郑', type: 'text', content: '所以', time: '20:38' },
        { id: 67, sender: '小冯', type: 'text', content: 'srds', time: '20:38' },
        { id: 68, sender: '小冯', type: 'text', content: '呜呜', time: '20:39' },
        { id: 69, sender: '小周', type: 'text', content: '确实', time: '20:39' },
        { id: 70, sender: '小郑', type: 'text', content: '冲', time: '20:39' },
        { id: 71, sender: '小王', type: 'text', content: '求', time: '20:40' },
        { id: 72, sender: '小郑', type: 'text', content: '好家伙', time: '20:40' },
        { id: 73, sender: '小赵', type: 'text', content: '懂了', time: '20:40' },
        { id: 74, sender: '小张', type: 'text', content: '真的假的', time: '20:40' },
        { id: 75, sender: '小周', type: 'text', content: '哈哈哈哈', time: '20:41' },
        { id: 76, sender: '小钱', type: 'text', content: '绷不住了', time: '20:41' },
        { id: 77, sender: '小钱', type: 'text', content: '啊', time: '20:41' },
        { id: 78, sender: '小郑', type: 'text', content: '有道理', time: '20:42' },
        { id: 79, sender: '小王', type: 'text', content: '笑不活了', time: '20:42' },
        { id: 80, sender: '小孙', type: 'text', content: '来了来了', time: '20:42' },
        { id: 81, sender: '小张', type: 'text', content: '嗯嗯嗯', time: '20:43' },
        { id: 82, sender: '助教张老师', type: 'text', content: '谁懂啊', time: '20:43' },
        { id: 83, sender: '小孙', type: 'text', content: '干饭', time: '20:43' },
        { id: 84, sender: '小钱', type: 'text', content: '救命', time: '20:43' },
        { id: 85, sender: '助教张老师', type: 'text', content: '强', time: '20:44' },
        { id: 86, sender: '小周', type: 'text', content: '2', time: '20:44' },
        { id: 87, sender: '小周', type: 'text', content: '这', time: '20:44' },
        { id: 88, sender: '小孙', type: 'text', content: '求', time: '20:45' },
        { id: 89, sender: '小周', type: 'text', content: '🔥', time: '20:45' },
        { id: 90, sender: '小郑', type: 'text', content: '冲', time: '20:45' },
        { id: 91, sender: '小王', type: 'text', content: '赞', time: '20:46' },
        { id: 92, sender: '小冯', type: 'text', content: '+1', time: '20:46' },
        { id: 93, sender: '小张', type: 'text', content: '可', time: '20:46' },
        { id: 94, sender: '助教张老师', type: 'text', content: '[表情包: 哭]', time: '20:46' },
        { id: 95, sender: '助教张老师', type: 'text', content: '1', time: '20:47' },
        { id: 96, sender: '小陈', type: 'text', content: '哈', time: '20:47' },
        { id: 97, sender: '助教张老师', type: 'text', content: '啥', time: '20:47' },
        { id: 98, sender: '小钱', type: 'text', content: '😭', time: '20:48' },
        { id: 99, sender: '小郑', type: 'text', content: '嗯嗯', time: '20:48' },
        { id: 100, sender: '小陈', type: 'text', content: '求', time: '21:46' },
        { id: 101, sender: '小王', type: 'text', content: '摆烂', time: '21:46' },
        { id: 102, sender: '小钱', type: 'text', content: '所以', time: '21:46' },
        { id: 103, sender: '小张', type: 'text', content: '💀', time: '21:47' },
        { id: 104, sender: '小钱', type: 'text', content: '冲', time: '21:47' },
        { id: 105, sender: '小赵', type: 'text', content: '好家伙', time: '21:48' },
        { id: 106, sender: '小吴', type: 'text', content: '[语音消息]', time: '21:48' },
        { id: 107, sender: '小陈', type: 'text', content: '不是吧', time: '21:48' },
        { id: 108, sender: '小冯', type: 'text', content: '咋办', time: '21:49' },
        { id: 109, sender: '小吴', type: 'text', content: '好的好的', time: '21:49' },
        { id: 110, sender: '小张', type: 'text', content: '蚌埠住了', time: '21:50' },
        { id: 111, sender: '小孙', type: 'text', content: '确实', time: '21:50' },
        { id: 112, sender: '小吴', type: 'text', content: 'OK', time: '21:50' },
        { id: 113, sender: '小郑', type: 'text', content: '蚌埠住了', time: '21:51' },
        { id: 114, sender: '小张', type: 'text', content: '强', time: '21:51' },
        { id: 115, sender: '助教张老师', type: 'text', content: '[表情包: 哭]', time: '21:52' },
        { id: 116, sender: '小冯', type: 'text', content: '👍', time: '21:52' },
        { id: 117, sender: '助教张老师', type: 'text', content: 'awsl', time: '21:52' },
        { id: 118, sender: '小吴', type: 'text', content: '[表情包: 哭]', time: '21:53' },
        { id: 119, sender: '小钱', type: 'text', content: '卷王', time: '21:53' }
      ]
    },
    3: {
      groupName: '手绘打卡群',
      messages: [
        { id: 1, sender: '小张', type: 'text', content: '有没有人教教我透视啊 我画了一晚上', time: '22:00' },
        { id: 2, sender: '小李', type: 'text', content: '哪张 我看看', time: '22:01' },
        { id: 3, sender: '小王', type: 'text', content: '一点透视？', time: '22:02' },
        { id: 4, sender: '小张', type: 'text', content: '对 透视关系一直画不对', time: '22:03' },
        { id: 5, sender: '小陈', type: 'text', content: '这图用两点透视就行 你试试', time: '22:05' },
        { id: 6, sender: '小张', type: 'text', content: '但是效果会不会不够强啊', time: '22:06' },
        { id: 7, sender: '小李', type: 'text', content: '加点阴影试试 用排线', time: '22:07' },
        { id: 8, sender: '小王', type: 'text', content: '这个透视不太对吧', time: '10:30' },
        { id: 9, sender: '小陈', type: 'text', content: '为啥不对 我觉得可以啊', time: '10:31' },
        { id: 10, sender: '小张', type: 'text', content: '对啊 我试了可以画出来', time: '10:32' },
        { id: 11, sender: '小李', type: 'text', content: '哦我看错了 抱歉', time: '10:33' },
        { id: 12, sender: '小王', type: 'text', content: '没事 哈哈', time: '10:34' },
        { id: 13, sender: '小赵', type: 'text', content: '群里都是大佬', time: '10:35' },
        { id: 14, sender: '小钱', type: 'text', content: '[表情包: 笑哭]', time: '10:36' },
        { id: 15, sender: '小孙', type: 'text', content: '笑死 xswl', time: '10:37' },
        { id: 16, sender: '小周', type: 'text', content: '确实 tql', time: '10:38' },
        { id: 17, sender: '小吴', type: 'text', content: '我也想学', time: '10:39' },
        { id: 18, sender: '小郑', type: 'text', content: '+1', time: '10:40' },
        { id: 19, sender: '小冯', type: 'text', content: '哈哈哈哈哈', time: '10:41' },
        { id: 20, sender: '小杨', type: 'text', content: '666', time: '10:42' }
      ]
    },
    4: {
      groupName: '手绘搭子小王',
      isPrivate: true,
      messages: [
        { id: 1, sender: '小王', type: 'text', content: '在吗', time: '上周六 14:00' },
        { id: 2, sender: '小王', type: 'text', content: '新买了支红环 巨顺滑', time: '上周六 14:01' },
        { id: 3, sender: '小王', type: 'text', content: '画了张建筑草图 你看看', time: '上周六 14:02' },
        { id: 4, sender: '小王', type: 'text', content: '[图片]', time: '上周六 14:03' },
        { id: 5, sender: '小王', type: 'text', content: '看到没 线条多流畅', time: '上周六 14:03' },
        { id: 6, sender: '小王', type: 'text', content: '？？', time: '上周六 21:00' },
        { id: 7, sender: '小王', type: 'text', content: '忙啥呢', time: '上周六 21:01' },
        { id: 8, sender: '小王', type: 'text', content: '算了 你忙吧 下次再约', time: '上周六 21:02' },
        { id: 9, sender: '小王', type: 'text', content: '最近咋样啊 还在肝毕设吗', time: '昨天 10:00' },
        { id: 10, sender: '小王', type: 'text', content: '有空一起画图啊 互相监督', time: '昨天 10:01' },
        { id: 11, sender: '小王', type: 'text', content: '我的手绘都退步了😭', time: '昨天 10:02' }
      ]
    },
    5: {
      groupName: '毕设搭子小李',
      isPrivate: true,
      messages: [
        { id: 1, sender: '小李', type: 'text', content: '哥们 我要闭关了', time: '2个月前' },
        { id: 2, sender: '小李', type: 'text', content: '毕设最后一个月 不怎么看手机了', time: '2个月前' },
        { id: 3, sender: '小李', type: 'text', content: '等我答辩完再来约', time: '2个月前' },
        { id: 4, sender: '小李', type: 'text', content: '加油啊 你也好好搞', time: '2个月前' },
        { id: 5, sender: '小陈', type: 'text', content: '好的 祝你答辩顺利！', time: '2个月前' },
        { id: 6, sender: '小陈', type: 'text', content: '答辩完记得找我 我请你喝咖啡', time: '2个月前' },
        { id: 7, sender: '小李', type: 'text', content: '哈哈好 一言为定', time: '2个月前' },
        { id: 8, sender: '小李', type: 'text', content: '闭关中，勿扰', time: '1个月前' }
      ]
    },
    6: {
      groupName: '室友小张',
      isPrivate: true,
      messages: [
        { id: 1, sender: '小张', type: 'text', content: '帮我带杯咖啡呗', time: '10:30' },
        { id: 2, sender: '小张', type: 'text', content: '我在专教占座了 不想回去', time: '10:31' },
        { id: 3, sender: '小张', type: 'text', content: '随便买杯就行', time: '10:31' },
        { id: 4, sender: '小张', type: 'text', content: '谢谢兄弟！', time: '10:32' },
        { id: 5, sender: '小张', type: 'text', content: '回头请你喝奶茶', time: '10:32' },
        { id: 6, sender: '小陈', type: 'text', content: '行 要啥', time: '10:35' },
        { id: 7, sender: '小张', type: 'text', content: '美式吧 加冰', time: '10:36' },
        { id: 8, sender: '小张', type: 'text', content: '谢谢！', time: '10:36' },
        { id: 9, sender: '小陈', type: 'text', content: '好', time: '10:37' }
      ]
    },
    7: {
      groupName: '班级群',
      messages: [
        { id: 1, sender: '班长小刘', type: 'text', content: '明天照常上课 老师说了不调课', time: '09:30' },
        { id: 2, sender: '小王', type: 'text', content: '收到', time: '09:31' },
        { id: 3, sender: '小李', type: 'text', content: '好的', time: '09:32' },
        { id: 4, sender: '辅导员王老师', type: 'text', content: '@全体成员 下周一之前交学年鉴定表', time: '10:00' },
        { id: 5, sender: '小张', type: 'text', content: '收到', time: '10:01' },
        { id: 6, sender: '小陈', type: 'text', content: '收到', time: '10:01' },
        { id: 7, sender: '小赵', type: 'text', content: '+1', time: '10:02' },
        { id: 8, sender: '团支书小美', type: 'text', content: '还没交的同学抓紧哦 学院催了', time: '14:00' },
        { id: 9, sender: '小钱', type: 'text', content: '等下 我还没写', time: '14:01' },
        { id: 10, sender: '小孙', type: 'text', content: '哈哈我也是', time: '14:02' },
        { id: 11, sender: '班长小刘', type: 'text', content: '哈哈你们这群ddl战士', time: '14:03' },
        { id: 12, sender: '小周', type: 'text', content: 'xswl', time: '14:04' },
        { id: 13, sender: '小吴', type: 'text', content: '别说了 我也不想拖', time: '14:05' }
      ]
    }
  },
  lin: {
    1: {
      groupName: '动漫同好群',
      messages: [
        { id: 1, sender: '小刚', type: 'text', content: '新番看了吗！！这一集太炸了', time: '10:00' },
        { id: 2, sender: '小红', type: 'text', content: '没有！！别剧透！！', time: '10:01' },
        { id: 3, sender: '小明', type: 'text', content: '哈哈哈哈哈笑死', time: '10:02' },
        { id: 4, sender: '小刚', type: 'text', content: '不是 我真的很激动', time: '10:03' },
        { id: 5, sender: '小李', type: 'text', content: '啥番啥番 我也去看', time: '10:04' },
        { id: 6, sender: '小红', type: 'text', content: '别说了别说了！！！', time: '10:05' },
        { id: 7, sender: '小美', type: 'text', content: '哈哈哈哈哈', time: '10:06' },
        { id: 8, sender: '小丽', type: 'text', content: '为啥', time: '10:06' },
        { id: 9, sender: '小刚', type: 'text', content: '真的假的', time: '10:06' },
        { id: 10, sender: '小张', type: 'text', content: 'u1s1', time: '10:06' },
        { id: 11, sender: '小强', type: 'text', content: '那个', time: '10:06' },
        { id: 12, sender: '小强', type: 'text', content: '啥', time: '10:07' },
        { id: 13, sender: '小王', type: 'text', content: '收到', time: '10:07' },
        { id: 14, sender: '小王', type: 'text', content: '可', time: '10:07' },
        { id: 15, sender: '小强', type: 'text', content: '绷不住了', time: '10:08' },
        { id: 16, sender: '小林', type: 'text', content: '[语音消息]', time: '10:08' },
        { id: 17, sender: '小明', type: 'text', content: '[表情包: 哭]', time: '10:08' },
        { id: 18, sender: '小张', type: 'text', content: '+1', time: '10:09' },
        { id: 19, sender: '小丽', type: 'text', content: '啥', time: '10:09' },
        { id: 20, sender: '小华', type: 'text', content: '懂了', time: '10:09' },
        { id: 21, sender: '小刚', type: 'text', content: '嗯嗯嗯', time: '10:09' },
        { id: 22, sender: '小王', type: 'text', content: '😂', time: '10:10' },
        { id: 23, sender: '小张', type: 'text', content: '👍', time: '10:10' },
        { id: 24, sender: '小林', type: 'text', content: '[语音消息]', time: '10:10' },
        { id: 25, sender: '小林', type: 'text', content: '卷王', time: '10:11' },
        { id: 26, sender: '小华', type: 'text', content: '干饭', time: '10:11' },
        { id: 27, sender: '小丽', type: 'text', content: '为啥', time: '10:11' },
        { id: 28, sender: '小刚', type: 'text', content: '太真实了', time: '10:12' },
        { id: 29, sender: '小明', type: 'text', content: '🔥', time: '10:12' },
        { id: 30, sender: '小李', type: 'text', content: 'yyds', time: '10:12' },
        { id: 31, sender: '小丽', type: 'text', content: '救命', time: '10:12' },
        { id: 32, sender: '小美', type: 'text', content: '2', time: '10:13' },
        { id: 33, sender: '小丽', type: 'text', content: 'srds', time: '10:13' },
        { id: 34, sender: '小刚', type: 'text', content: '强', time: '10:13' },
        { id: 35, sender: '小张', type: 'text', content: '好的', time: '10:14' },
        { id: 36, sender: '小林', type: 'text', content: '+1', time: '10:14' },
        { id: 37, sender: '小强', type: 'text', content: '👍', time: '10:14' },
        { id: 38, sender: '小林', type: 'text', content: '绷不住了', time: '10:15' },
        { id: 39, sender: '小李', type: 'text', content: 'ok', time: '10:15' },
        { id: 40, sender: '小丽', type: 'text', content: '牛', time: '10:15' },
        { id: 41, sender: '小华', type: 'text', content: '摆烂', time: '10:15' },
        { id: 42, sender: '小丽', type: 'text', content: 'emmm', time: '10:16' },
        { id: 43, sender: '小张', type: 'text', content: '555', time: '10:16' },
        { id: 44, sender: '小丽', type: 'text', content: '绷不住了', time: '10:16' },
        { id: 45, sender: '小张', type: 'text', content: '绝了', time: '10:17' },
        { id: 46, sender: '小林', type: 'text', content: 'ok', time: '10:17' },
        { id: 47, sender: '小强', type: 'text', content: '救命', time: '10:17' },
        { id: 48, sender: '小丽', type: 'text', content: '确实', time: '10:18' },
        { id: 49, sender: '小刚', type: 'text', content: '啊', time: '10:18' },
        { id: 50, sender: '小刚', type: 'text', content: '@小林 你看了吗', time: '10:30' },
        { id: 51, sender: '小红', type: 'text', content: '小林最近忙吧', time: '10:31' },
        { id: 52, sender: '小张', type: 'text', content: '上次一起看还是上个月', time: '10:32' },
        { id: 53, sender: '小刚', type: 'text', content: '出新番就说一声啊', time: '10:33' },
        { id: 54, sender: '小李', type: 'text', content: '+1 一起追番', time: '10:34' },
        { id: 55, sender: '小刚', type: 'text', content: '@小林 你怎么消失了 最近都没一起追番了', time: '10:35' },
        { id: 56, sender: '小王', type: 'text', content: '小林可能学业忙吧', time: '10:36' },
        { id: 57, sender: '小美', type: 'text', content: '是啊 好久没看到她了', time: '10:37' },
        { id: 58, sender: '小红', type: 'text', content: '小林记得看！', time: '10:38' },
        { id: 59, sender: '小强', type: 'text', content: '好的好的', time: '10:38' },
        { id: 60, sender: '小林', type: 'text', content: '躺平', time: '10:38' },
        { id: 61, sender: '小美', type: 'text', content: 'awsl', time: '10:38' },
        { id: 62, sender: '小强', type: 'text', content: '可', time: '10:39' },
        { id: 63, sender: '小王', type: 'text', content: '1', time: '10:39' },
        { id: 64, sender: '小强', type: 'text', content: '干饭', time: '10:40' },
        { id: 65, sender: '小红', type: 'text', content: '哈', time: '10:40' },
        { id: 66, sender: '小美', type: 'text', content: 'awsl', time: '10:40' },
        { id: 67, sender: '小丽', type: 'text', content: '啊', time: '10:41' },
        { id: 68, sender: '小刚', type: 'text', content: '哈哈哈哈', time: '10:41' },
        { id: 69, sender: '小李', type: 'text', content: '？？？', time: '10:42' },
        { id: 70, sender: '小林', type: 'text', content: '等等', time: '10:42' },
        { id: 71, sender: '小林', type: 'text', content: '绝了', time: '10:42' },
        { id: 72, sender: '小华', type: 'text', content: 'ok', time: '10:43' },
        { id: 73, sender: '小王', type: 'text', content: '💀', time: '10:43' },
        { id: 74, sender: '小刚', type: 'text', content: 'u1s1', time: '10:44' },
        { id: 75, sender: '小李', type: 'text', content: '哈', time: '10:44' },
        { id: 76, sender: '小王', type: 'text', content: '那个', time: '10:44' },
        { id: 77, sender: '小强', type: 'text', content: '来了来了', time: '10:45' },
        { id: 78, sender: '小林', type: 'text', content: '绷不住了', time: '10:45' },
        { id: 79, sender: '小李', type: 'text', content: '嗯嗯嗯', time: '10:46' },
        { id: 80, sender: '小强', type: 'text', content: '这集打戏太燃了', time: '11:00' },
        { id: 81, sender: '小丽', type: 'text', content: '作画也超棒的', time: '11:01' },
        { id: 82, sender: '小华', type: 'text', content: '这季度霸权预定', time: '11:02' },
        { id: 83, sender: '小刚', type: 'text', content: '必须的啊', time: '11:03' },
        { id: 84, sender: '小明', type: 'text', content: '片尾曲也好好听', time: '11:04' },
        { id: 85, sender: '小李', type: 'text', content: 'tql', time: '11:04' },
        { id: 86, sender: '小林', type: 'text', content: '等等', time: '11:04' },
        { id: 87, sender: '小美', type: 'text', content: '太真实了', time: '11:04' },
        { id: 88, sender: '小强', type: 'text', content: '绝了', time: '11:05' },
        { id: 89, sender: '小明', type: 'text', content: 'xswl', time: '11:05' },
        { id: 90, sender: '小刚', type: 'text', content: '真的假的', time: '11:06' },
        { id: 91, sender: '小林', type: 'text', content: '好的好的', time: '11:06' },
        { id: 92, sender: '小张', type: 'text', content: '[语音消息]', time: '11:06' },
        { id: 93, sender: '小林', type: 'text', content: '😂', time: '11:07' },
        { id: 94, sender: '小刚', type: 'text', content: 'ok', time: '11:07' },
        { id: 95, sender: '小强', type: 'text', content: '赞', time: '11:08' },
        { id: 96, sender: '小强', type: 'text', content: '啊', time: '11:08' },
        { id: 97, sender: '小林', type: 'text', content: 'xswl', time: '11:08' },
        { id: 98, sender: '小林', type: 'text', content: '[图片]', time: '11:09' },
        { id: 99, sender: '小红', type: 'text', content: '好的好的', time: '11:09' },
        { id: 100, sender: '小强', type: 'text', content: '等等', time: '11:10' },
        { id: 101, sender: '小美', type: 'text', content: '哈', time: '11:10' },
        { id: 102, sender: '小王', type: 'text', content: '好的', time: '11:10' },
        { id: 103, sender: '小丽', type: 'text', content: '[图片]', time: '11:11' },
        { id: 104, sender: '小华', type: 'text', content: '离谱', time: '11:11' },
        { id: 105, sender: '小明', type: 'text', content: '555', time: '11:12' },
        { id: 106, sender: '小明', type: 'text', content: '💀', time: '11:12' },
        { id: 107, sender: '小丽', type: 'text', content: '哈哈哈哈', time: '11:12' },
        { id: 108, sender: '小张', type: 'text', content: '懂了', time: '11:13' },
        { id: 109, sender: '小红', type: 'text', content: '摆烂', time: '11:13' },
        { id: 110, sender: '小丽', type: 'text', content: '来了来了', time: '11:14' },
        { id: 111, sender: '小红', type: 'text', content: '嗯嗯嗯', time: '11:14' },
        { id: 112, sender: '小丽', type: 'text', content: '救命', time: '11:14' },
        { id: 113, sender: '小美', type: 'text', content: '绷不住了', time: '11:15' },
        { id: 114, sender: '小丽', type: 'text', content: '哈哈哈哈', time: '11:15' },
        { id: 115, sender: '小林', type: 'text', content: '有道理', time: '11:16' },
        { id: 116, sender: '小张', type: 'text', content: '哈哈哈哈', time: '11:16' },
        { id: 117, sender: '小华', type: 'text', content: '[图片]', time: '11:16' },
        { id: 118, sender: '小强', type: 'text', content: '💀', time: '11:17' },
        { id: 119, sender: '小明', type: 'text', content: '😂', time: '11:17' }
      ]
    },
    2: {
      groupName: '羽毛球群',
      messages: [
        { id: 1, sender: '小美', type: 'text', content: '周六有人打球吗', time: '09:00' },
        { id: 2, sender: '小强', type: 'text', content: '我去！几点？', time: '09:01' },
        { id: 3, sender: '小丽', type: 'text', content: '我也可以', time: '09:02' },
        { id: 4, sender: '小华', type: 'text', content: '下午3点老地方？', time: '09:03' },
        { id: 5, sender: '小美', type: 'text', content: '好！@小林 @小强 你们呢', time: '09:04' },
        { id: 6, sender: '小强', type: 'text', content: '可以', time: '09:05' },
        { id: 7, sender: '小丽', type: 'text', content: '周六有人吗', time: '11:20' },
        { id: 8, sender: '小华', type: 'text', content: '我 我报名', time: '11:21' },
        { id: 9, sender: '小刚', type: 'text', content: '算我一个', time: '11:22' },
        { id: 10, sender: '小美', type: 'text', content: '好 那还是下午3点吗', time: '11:23' },
        { id: 11, sender: '小强', type: 'text', content: '对对 老地方 体育馆', time: '11:24' },
        { id: 12, sender: '小丽', type: 'text', content: '记得带拍子啊', time: '11:25' },
        { id: 13, sender: '小华', type: 'text', content: '你们最近水平咋样了', time: '11:30' },
        { id: 14, sender: '小刚', type: 'text', content: '我最近在练反手', time: '11:31' },
        { id: 15, sender: '小美', type: 'text', content: '哈哈 小刚终于肯动起来了', time: '11:32' },
        { id: 16, sender: '小强', type: 'text', content: '别说了 我被小林虐惨了', time: '11:33' },
        { id: 17, sender: '小丽', type: 'text', content: '哈哈哈小林太厉害了', time: '11:34' },
        { id: 18, sender: '小华', type: 'text', content: '小林呢 @小林 来了吗', time: '11:35' },
        { id: 19, sender: '小美', type: 'text', content: '小林最近好像很忙 上次也没来', time: '11:36' },
        { id: 20, sender: '小刚', type: 'text', content: '是啊 好久没看到她了', time: '11:37' }
      ]
    },
    3: {
      groupName: '学生会群',
      messages: [
        { id: 1, sender: '主席小王', type: 'text', content: '下周活动报名开始了 大家积极参加', time: '10:00' },
        { id: 2, sender: '小李', type: 'text', content: '收到！', time: '10:01' },
        { id: 3, sender: '文体部长小美', type: 'text', content: '下周活动报名', time: '10:02' },
        { id: 4, sender: '小陈', type: 'text', content: '啥活动啊', time: '10:03' },
        { id: 5, sender: '主席小王', type: 'text', content: '校园歌手大赛 大家可以报名当观众', time: '10:04' },
        { id: 6, sender: '文体部长小美', type: 'text', content: '？？？', time: '10:04' },
        { id: 7, sender: '主席小王', type: 'text', content: '啊这', time: '10:04' },
        { id: 8, sender: '主席小王', type: 'text', content: '卧槽', time: '10:05' },
        { id: 9, sender: '文体部长小美', type: 'text', content: '确实', time: '10:05' },
        { id: 10, sender: '文体部长小美', type: 'text', content: '666', time: '10:06' },
        { id: 11, sender: '文体部长小美', type: 'text', content: '笑死', time: '10:06' },
        { id: 12, sender: '小陈', type: 'text', content: '+1', time: '10:07' },
        { id: 13, sender: '小钱', type: 'text', content: 'emmm', time: '10:07' },
        { id: 14, sender: '小赵', type: 'text', content: '哈', time: '10:08' },
        { id: 15, sender: '文体部长小美', type: 'text', content: '谢谢大家！@全体成员 下周三下午彩排', time: '10:10' },
        { id: 16, sender: '小孙', type: 'text', content: '收到', time: '10:11' },
        { id: 17, sender: '小周', type: 'text', content: '收到！', time: '10:11' },
        { id: 18, sender: '小吴', type: 'text', content: '好的 记下了', time: '10:12' },
        { id: 19, sender: '主席小王', type: 'text', content: '彩排完还有零食饮料 大家来啊', time: '10:15' },
        { id: 20, sender: '小李', type: 'text', content: '哈哈哈冲', time: '10:16' },
        { id: 21, sender: '主席小王', type: 'text', content: 'xswl', time: '10:16' },
        { id: 22, sender: '小钱', type: 'text', content: '蚌埠住了', time: '10:16' },
        { id: 23, sender: '主席小王', type: 'text', content: '哈', time: '10:17' },
        { id: 24, sender: '小赵', type: 'text', content: '牛', time: '10:17' }
      ]
    },
    4: {
      groupName: '动漫搭子小刚',
      isPrivate: true,
      messages: [
        { id: 1, sender: '小刚', type: 'text', content: '在吗', time: '上周' },
        { id: 2, sender: '小刚', type: 'text', content: '出新番了！！', time: '上周' },
        { id: 3, sender: '小刚', type: 'text', content: '超好看 你看了吗', time: '上周' },
        { id: 4, sender: '小刚', type: 'text', content: '？', time: '上周' },
        { id: 5, sender: '小刚', type: 'text', content: '好吧 你可能在忙', time: '上周' },
        { id: 6, sender: '小刚', type: 'text', content: '周末一起看吗', time: '3天前' },
        { id: 7, sender: '小刚', type: 'text', content: '好久没一起追番了 有点想你', time: '3天前' },
        { id: 8, sender: '小刚', type: 'text', content: 'xswl 开玩笑的', time: '3天前' },
        { id: 9, sender: '小刚', type: 'text', content: '但是真的好久没一起看了', time: '3天前' }
      ]
    },
    5: {
      groupName: '羽毛球搭子小美',
      isPrivate: true,
      messages: [
        { id: 1, sender: '小美', type: 'text', content: '最近好忙啊', time: '3天前' },
        { id: 2, sender: '小美', type: 'text', content: '学生会那边活动太多了', time: '3天前' },
        { id: 3, sender: '小美', type: 'text', content: '都没时间打球了', time: '3天前' },
        { id: 4, sender: '小美', type: 'text', content: '上次一起打还是什么时候来着', time: '3天前' },
        { id: 5, sender: '小美', type: 'text', content: '我都快忘了', time: '3天前' },
        { id: 6, sender: '小美', type: 'text', content: '[表情包: 捂脸]', time: '3天前' },
        { id: 7, sender: '小美', type: 'text', content: '有空约！', time: '3天前' },
        { id: 8, sender: '小美', type: 'text', content: '你最近咋样', time: '3天前' }
      ]
    },
    6: {
      groupName: '闺蜜小雪',
      isPrivate: true,
      messages: [
        { id: 1, sender: '小雪', type: 'text', content: '哈哈哈哈哈哈笑死', time: '刚刚' },
        { id: 2, sender: '小雪', type: 'text', content: '你看到那个视频了吗', time: '刚刚' },
        { id: 3, sender: '小雪', type: 'text', content: '[链接]', time: '刚刚' },
        { id: 4, sender: '小雪', type: 'text', content: '太好笑了xswl', time: '刚刚' },
        { id: 5, sender: '小雪', type: 'text', content: '我们学校的哈哈哈哈', time: '刚刚' },
        { id: 6, sender: '小雪', type: 'text', content: '看到第三个没 笑死我了', time: '刚刚' },
        { id: 7, sender: '小雪', type: 'text', content: '我室友说她们班也有这种人', time: '刚刚' }
      ]
    },
    7: {
      groupName: '老王',
      isPrivate: true,
      messages: [
        { id: 1, sender: '老王', type: 'text', content: '明天老地方见！', time: '昨天' },
        { id: 2, sender: '老王', type: 'text', content: '别忘了啊', time: '昨天' },
        { id: 3, sender: '老王', type: 'text', content: '老地方就是上次吃饭那个店', time: '昨天' },
        { id: 4, sender: '老王', type: 'text', content: '6点可以吗', time: '昨天' },
        { id: 5, sender: '老王', type: 'text', content: '对了 明天我生日 你知道的吧', time: '昨天' },
        { id: 6, sender: '老王', type: 'text', content: '不用带礼物 人来就行', time: '昨天' },
        { id: 7, sender: '老王', type: 'text', content: '哈哈开玩笑的 随便带点啥', time: '昨天' },
        { id: 8, sender: '老王', type: 'text', content: '好久没聚了 期待', time: '昨天' }
      ]
    }
  },
  zhou: {
    1: {
      groupName: '新生群',
      messages: [
        { id: 1, sender: '学长A', type: 'text', content: '新生群正式成立啦 欢迎大家', time: '08:00' },
        { id: 2, sender: '小李', type: 'text', content: '报到！', time: '08:01' },
        { id: 3, sender: '小王', type: 'text', content: '收到！', time: '08:02' },
        { id: 4, sender: '小红', type: 'text', content: '学长好！', time: '08:03' },
        { id: 5, sender: '辅导员王老师', type: 'text', content: '欢迎大家来到电子信息学院！有问题随时问', time: '08:05' },
        { id: 6, sender: '小张', type: 'text', content: '老师好！', time: '08:06' },
        { id: 7, sender: '小赵', type: 'text', content: '收到！', time: '08:07' },
        { id: 8, sender: '学长B', type: 'text', content: '有问题可以问我 我是你们的带班学长', time: '08:10' },
        { id: 9, sender: '学姐C', type: 'text', content: '我也是带班学姐～有问题找我', time: '08:11' },
        { id: 10, sender: '小钱', type: 'text', content: '请问宿舍怎么分配啊', time: '08:15' },
        { id: 11, sender: '小冯', type: 'text', content: '哈', time: '08:15' },
        { id: 12, sender: '小冯', type: 'text', content: '摆烂', time: '08:15' },
        { id: 13, sender: '小孙', type: 'text', content: '好的', time: '08:15' },
        { id: 14, sender: '学长A', type: 'text', content: '[表情包: 哭]', time: '08:15' },
        { id: 15, sender: '小周', type: 'text', content: '来了来了', time: '08:16' },
        { id: 16, sender: '小王', type: 'text', content: '太真实了', time: '08:16' },
        { id: 17, sender: '小赵', type: 'text', content: '嗯嗯嗯', time: '08:16' },
        { id: 18, sender: '学长B', type: 'text', content: '谁懂啊', time: '08:17' },
        { id: 19, sender: '辅导员王老师', type: 'text', content: '666', time: '08:17' },
        { id: 20, sender: '小冯', type: 'text', content: '卷王', time: '08:17' },
        { id: 21, sender: '小张', type: 'text', content: '笑不活了', time: '08:18' },
        { id: 22, sender: '小吴', type: 'text', content: '笑不活了', time: '08:18' },
        { id: 23, sender: '小吴', type: 'text', content: '哈', time: '08:18' },
        { id: 24, sender: '小孙', type: 'text', content: '等等', time: '08:18' },
        { id: 25, sender: '小李', type: 'text', content: '这', time: '08:19' },
        { id: 26, sender: '小红', type: 'text', content: '2', time: '08:19' },
        { id: 27, sender: '小郑', type: 'text', content: '咋办', time: '08:19' },
        { id: 28, sender: '小赵', type: 'text', content: 'srds', time: '08:20' },
        { id: 29, sender: '学长A', type: 'text', content: '咋办', time: '08:20' },
        { id: 30, sender: '小周', type: 'text', content: '绝了', time: '08:20' },
        { id: 31, sender: '小孙', type: 'text', content: '嗯嗯', time: '08:21' },
        { id: 32, sender: '小周', type: 'text', content: '[表情包: 哭]', time: '08:21' },
        { id: 33, sender: '学长C', type: 'text', content: '🔥', time: '08:21' },
        { id: 34, sender: '小李', type: 'text', content: '啊啊啊', time: '08:21' },
        { id: 35, sender: '小李', type: 'text', content: '💀', time: '08:22' },
        { id: 36, sender: '学长B', type: 'text', content: '好的好的', time: '08:22' },
        { id: 37, sender: '小李', type: 'text', content: '🔥', time: '08:22' },
        { id: 38, sender: '学姐C', type: 'text', content: '真的假的', time: '08:23' },
        { id: 39, sender: '小吴', type: 'text', content: '可', time: '08:23' },
        { id: 40, sender: '学长A', type: 'text', content: '蚌埠住了', time: '08:23' },
        { id: 41, sender: '阿杰', type: 'text', content: '那个', time: '08:24' },
        { id: 42, sender: '小周', type: 'text', content: 'tql', time: '08:24' },
        { id: 43, sender: '小张', type: 'text', content: '2', time: '08:24' },
        { id: 44, sender: '小周', type: 'text', content: '卧槽', time: '08:24' },
        { id: 45, sender: '辅导员王老师', type: 'text', content: '绝了', time: '08:25' },
        { id: 46, sender: '学长A', type: 'text', content: '干饭', time: '08:25' },
        { id: 47, sender: '小红', type: 'text', content: '不是吧', time: '08:25' },
        { id: 48, sender: '小李', type: 'text', content: '🔥', time: '08:26' },
        { id: 49, sender: '小周', type: 'text', content: '冲', time: '08:26' },
        { id: 50, sender: '小吴', type: 'text', content: '收到', time: '08:26' },
        { id: 51, sender: '小冯', type: 'text', content: 'yyds', time: '08:27' },
        { id: 52, sender: '小郑', type: 'text', content: '？？', time: '08:27' },
        { id: 53, sender: '学长B', type: 'text', content: '好家伙', time: '08:27' },
        { id: 54, sender: '阿杰', type: 'text', content: '强', time: '08:27' },
        { id: 55, sender: '小李', type: 'text', content: '卧槽', time: '08:28' },
        { id: 56, sender: '小吴', type: 'text', content: '卷王', time: '08:28' },
        { id: 57, sender: '小周', type: 'text', content: '谁懂啊', time: '08:28' },
        { id: 58, sender: '小赵', type: 'text', content: '绷不住了', time: '08:29' },
        { id: 59, sender: '阿杰', type: 'text', content: '卷王', time: '08:29' },
        { id: 60, sender: '学长B', type: 'text', content: '@小周 你是哪个专业的来着', time: '09:00' },
        { id: 61, sender: '小周', type: 'text', content: '电子信息工程！', time: '09:01' },
        { id: 62, sender: '学长B', type: 'text', content: '好 我记下了 有问题找我', time: '09:02' },
        { id: 63, sender: '小周', type: 'text', content: '谢谢学长！', time: '09:03' },
        { id: 64, sender: '阿杰', type: 'text', content: '我也是电子信息的！', time: '09:04' },
        { id: 65, sender: '小周', type: 'text', content: '哇 缘分啊', time: '09:05' },
        { id: 66, sender: '阿杰', type: 'text', content: '@小周 我们一起去吧', time: '09:06' },
        { id: 67, sender: '小周', type: 'text', content: '好的！', time: '09:07' },
        { id: 68, sender: '小红', type: 'text', content: '？？？', time: '09:07' },
        { id: 69, sender: '阿杰', type: 'text', content: '好家伙', time: '09:07' },
        { id: 70, sender: '小冯', type: 'text', content: 'u1s1', time: '09:07' },
        { id: 71, sender: '小吴', type: 'text', content: '咋办', time: '09:08' },
        { id: 72, sender: '小王', type: 'text', content: '蚌埠住了', time: '09:08' },
        { id: 73, sender: '学姐C', type: 'text', content: '哈哈哈哈', time: '09:09' },
        { id: 74, sender: '学长A', type: 'text', content: 'ok', time: '09:09' },
        { id: 75, sender: '阿杰', type: 'text', content: '咋办', time: '09:09' },
        { id: 76, sender: '学姐C', type: 'text', content: '啊', time: '09:10' },
        { id: 77, sender: '小红', type: 'text', content: '赞', time: '09:10' },
        { id: 78, sender: '小红', type: 'text', content: '蚌埠住了', time: '09:11' },
        { id: 79, sender: '小赵', type: 'text', content: '有道理', time: '09:11' },
        { id: 80, sender: '学姐C', type: 'text', content: '牛', time: '09:11' },
        { id: 81, sender: '小张', type: 'text', content: '啥', time: '09:12' },
        { id: 82, sender: '小郑', type: 'text', content: '绷不住了', time: '09:12' },
        { id: 83, sender: '小红', type: 'text', content: 'bdjw', time: '09:13' },
        { id: 84, sender: '小张', type: 'text', content: '谁懂啊', time: '09:13' },
        { id: 85, sender: '小红', type: 'text', content: '绝了', time: '09:13' },
        { id: 86, sender: '阿杰', type: 'text', content: '+1', time: '09:14' },
        { id: 87, sender: '小张', type: 'text', content: '哈哈哈哈', time: '09:14' },
        { id: 88, sender: '小红', type: 'text', content: '收到', time: '09:15' },
        { id: 89, sender: '小张', type: 'text', content: '收到', time: '09:15' },
        { id: 90, sender: '小陈', type: 'text', content: '建议加个兴趣类的 丰富课余生活', time: '10:00' },
        { id: 91, sender: '小红', type: 'text', content: '有没有吉他社啊', time: '10:01' },
        { id: 92, sender: '学长B', type: 'text', content: '有！吉他社很活跃的', time: '10:02' },
        { id: 93, sender: '小周', type: 'text', content: '吉他社！！我要去', time: '10:03' },
        { id: 94, sender: '阿杰', type: 'text', content: '哈哈哈 你们都是吉他爱好者', time: '10:04' },
        { id: 95, sender: '学长C', type: 'text', content: '吉他社纳新群我发群里 感兴趣的加', time: '10:05' },
        { id: 96, sender: '小吴', type: 'text', content: '啊啊啊', time: '10:05' },
        { id: 97, sender: '阿杰', type: 'text', content: 'bdjw', time: '10:05' },
        { id: 98, sender: '小钱', type: 'text', content: '？？？', time: '10:05' },
        { id: 99, sender: '小冯', type: 'text', content: '2', time: '10:06' },
        { id: 100, sender: '小赵', type: 'text', content: '555', time: '10:06' },
        { id: 101, sender: '小红', type: 'text', content: '笑不活了', time: '10:07' },
        { id: 102, sender: '学长A', type: 'text', content: '啊', time: '10:07' },
        { id: 103, sender: '小周', type: 'text', content: '赞', time: '10:07' },
        { id: 104, sender: '辅导员王老师', type: 'text', content: '这', time: '10:08' },
        { id: 105, sender: '小李', type: 'text', content: '嗯嗯嗯', time: '10:08' },
        { id: 106, sender: '小冯', type: 'text', content: '有道理', time: '10:09' },
        { id: 107, sender: '小冯', type: 'text', content: '牛', time: '10:09' },
        { id: 108, sender: '学姐C', type: 'text', content: '懂了', time: '10:09' },
        { id: 109, sender: '阿杰', type: 'text', content: '太真实了', time: '10:10' },
        { id: 110, sender: '阿杰', type: 'text', content: '不是吧', time: '10:10' },
        { id: 111, sender: '小冯', type: 'text', content: '干饭', time: '10:11' },
        { id: 112, sender: '小红', type: 'text', content: '？？', time: '10:11' },
        { id: 113, sender: '小王', type: 'text', content: '笑不活了', time: '10:11' },
        { id: 114, sender: '小吴', type: 'text', content: '躺平', time: '10:12' },
        { id: 115, sender: '阿杰', type: 'text', content: '呜呜', time: '10:12' },
        { id: 116, sender: '小王', type: 'text', content: '为啥', time: '10:13' },
        { id: 117, sender: '小赵', type: 'text', content: '[语音消息]', time: '10:13' },
        { id: 118, sender: '小王', type: 'text', content: '哈哈哈哈', time: '10:13' },
        { id: 119, sender: '阿杰', type: 'text', content: '🔥', time: '10:14' }
      ]
    },
    2: {
      groupName: '吉他爱好者群',
      messages: [
        { id: 1, sender: '学长A', type: 'text', content: '有人想一起练吉他吗 新手也欢迎', time: '09:00' },
        { id: 2, sender: '学姐B', type: 'text', content: '我！我才学一个月', time: '09:01' },
        { id: 3, sender: '学长C', type: 'text', content: '推荐几个入门吉他频道给大家', time: '09:02' },
        { id: 4, sender: '小周', type: 'text', content: '有推荐的新手教程吗', time: '09:03' },
        { id: 5, sender: '学姐B', type: 'text', content: '我也想看！', time: '09:04' },
        { id: 6, sender: '学长A', type: 'text', content: '有的 等我找找', time: '09:05' },
        { id: 7, sender: '阿杰', type: 'text', content: '我也想学 一起吧', time: '09:06' },
        { id: 8, sender: '小周', type: 'text', content: '？？？', time: '09:07' },
        { id: 9, sender: '学姐B', type: 'text', content: '谁懂啊', time: '09:08' },
        { id: 10, sender: '小寒', type: 'text', content: '@小周 你不是一直想学吉他嘛 一起加入呗', time: '09:10' },
        { id: 11, sender: '小周', type: 'text', content: '好！一起', time: '09:11' },
        { id: 12, sender: '小寒', type: 'text', content: '哈哈 我教你', time: '09:12' },
        { id: 13, sender: '学姐E', type: 'text', content: '可', time: '09:13' },
        { id: 14, sender: '学长A', type: 'text', content: '@小周 新手教程找到了 等下发你', time: '11:30' },
        { id: 15, sender: '小周', type: 'text', content: '收到！谢谢学长🙏', time: '11:32' },
        { id: 16, sender: '学姐D', type: 'text', content: '[视频链接] 这个很适合新手', time: '11:35' },
        { id: 17, sender: '小周', type: 'text', content: '谢谢学姐！', time: '11:36' },
        { id: 18, sender: '小寒', type: 'text', content: '小周你现在学得咋样了', time: '11:40' },
        { id: 19, sender: '小周', type: 'text', content: '刚买了把入门吉他 正在练爬格子', time: '11:41' },
        { id: 20, sender: '小寒', type: 'text', content: '哈哈哈 我也是 从零开始', time: '11:42' },
        { id: 21, sender: '学姐B', type: 'text', content: '爬格子是基本功 坚持练！', time: '11:43' },
        { id: 22, sender: '小寒', type: 'text', content: '对 每天至少练半小时', time: '11:44' },
        { id: 23, sender: '小周', type: 'text', content: 'ok 我加油', time: '11:45' },
        { id: 24, sender: '小寒', type: 'text', content: '今晚练琴吗', time: '11:50' }
      ]
    },
    3: {
      groupName: '电子信息1班',
      messages: [
        { id: 1, sender: '班长小李', type: 'text', content: '明天照常上课 老师说了不调课', time: '09:30' },
        { id: 2, sender: '小王', type: 'text', content: '收到', time: '09:31' },
        { id: 3, sender: '小张', type: 'text', content: '好的', time: '09:32' },
        { id: 4, sender: '辅导员王老师', type: 'text', content: '@全体成员 新生见面会本周五14:00，教学楼A101，必须参加', time: '10:00' },
        { id: 5, sender: '小赵', type: 'text', content: '收到老师', time: '10:01' },
        { id: 6, sender: '小周', type: 'text', content: '收到', time: '10:01' },
        { id: 7, sender: '小孙', type: 'text', content: '为啥', time: '09:32' },
        { id: 8, sender: '小吴', type: 'text', content: '冲', time: '09:32' },
        { id: 9, sender: '小王', type: 'text', content: 'bdjw', time: '09:32' },
        { id: 10, sender: '小钱', type: 'text', content: 'awsl', time: '09:33' },
        { id: 11, sender: '小吴', type: 'text', content: '哈', time: '09:33' },
        { id: 12, sender: '阿杰', type: 'text', content: '[图片]', time: '09:34' },
        { id: 13, sender: '阿杰', type: 'text', content: '哈哈哈哈', time: '09:34' },
        { id: 14, sender: '小赵', type: 'text', content: '😭', time: '09:34' },
        { id: 17, sender: '小张', type: 'text', content: '躺平', time: '10:12' },
        { id: 18, sender: '小王', type: 'text', content: '嗯嗯', time: '10:12' },
        { id: 19, sender: '小周', type: 'text', content: '确实', time: '10:12' },
        { id: 20, sender: '小钱', type: 'text', content: '收到', time: '10:13' },
        { id: 21, sender: '小孙', type: 'text', content: 'yyds', time: '10:13' },
        { id: 22, sender: '班长小李', type: 'text', content: '嗯嗯嗯', time: '10:14' },
        { id: 23, sender: '班长小李', type: 'text', content: '好的', time: '10:14' },
        { id: 24, sender: '小钱', type: 'text', content: '牛', time: '10:14' },
        { id: 25, sender: '小周', type: 'text', content: '确实', time: '10:15' },
        { id: 26, sender: '小周', type: 'text', content: 'OK', time: '10:15' },
        { id: 27, sender: '小孙', type: 'text', content: '绝了', time: '10:16' },
        { id: 28, sender: '小周', type: 'text', content: 'awsl', time: '10:16' },
        { id: 29, sender: '小王', type: 'text', content: '笑不活了', time: '10:16' }
      ]
    },
    4: {
      groupName: '室友老王',
      isPrivate: true,
      messages: [
        { id: 1, sender: '老王', type: 'text', content: '永劫无间走起！', time: '昨天' },
        { id: 2, sender: '小周', type: 'text', content: '来！几点', time: '昨天' },
        { id: 3, sender: '老王', type: 'text', content: '晚上8点', time: '昨天' },
        { id: 4, sender: '小周', type: 'text', content: '好 到时候叫我', time: '昨天' },
        { id: 5, sender: '老王', type: 'text', content: '小周 借我一下充电宝 我的没电了', time: '11:00' },
        { id: 6, sender: '小周', type: 'text', content: '好嘞，在桌子上', time: '11:05' },
        { id: 7, sender: '老王', type: 'text', content: '谢啦兄弟', time: '11:10' }
      ]
    },
    5: {
      groupName: '吉他学长小寒',
      isPrivate: true,
      messages: [
        { id: 1, sender: '小寒', type: 'text', content: '今晚练琴吗', time: '刚刚' },
        { id: 2, sender: '小周', type: 'text', content: '练！今天学了新和弦', time: '刚刚' },
        { id: 3, sender: '小寒', type: 'text', content: '哪个？', time: '刚刚' },
        { id: 4, sender: '小周', type: 'text', content: 'F和弦 终于能按响了', time: '刚刚' },
        { id: 5, sender: '小寒', type: 'text', content: '牛啊F和弦是新手大关', time: '刚刚' },
        { id: 6, sender: '小寒', type: 'text', content: '周六社团有活动 你来不来', time: '刚刚' },
        { id: 7, sender: '小周', type: 'text', content: '来！几点', time: '刚刚' },
        { id: 8, sender: '小寒', type: 'text', content: '下午2点 阿琴学姐也在', time: '刚刚' }
      ]
    },
    6: {
      groupName: '学姐小陈',
      isPrivate: true,
      messages: [
        { id: 1, sender: '学姐小陈', type: 'text', content: '大创项目加油呀', time: '昨天' },
        { id: 2, sender: '学姐小陈', type: 'text', content: '有什么不懂的可以问我', time: '昨天' },
        { id: 3, sender: '学姐小陈', type: 'text', content: '我也是从大一过来的', time: '昨天' },
        { id: 4, sender: '学姐小陈', type: 'text', content: '当时我也做过大创', time: '昨天' },
        { id: 5, sender: '学姐小陈', type: 'text', content: '经验还是有一些的', time: '昨天' },
        { id: 6, sender: '学姐小陈', type: 'text', content: '加油！期待你们的结果', time: '昨天' }
      ]
    }
  }
};

export const QBUGDY_CARDS = {
  chen: [
    {
      id: 'chen_card1',
      type: 'ddl',
      category: 'todo',
      title: '📢 DDL提醒',
      summary: '建筑结构大作业DDL提前到5月6日',
      detail: {
        group: '建筑设计原理群',
        content: '助教小王：【重要】建筑结构大作业DDL提前到5月6日中午12点！',
        deadline: '5月6日 12:00',
        urgency: 'high'
      },
      action: '一键跳转到群消息',
      highlight: ['助教小王']
    },
    {
      id: 'chen_card2',
      type: 'vote',
      category: 'todo',
      title: '🗳️ 投票提醒',
      summary: '毕设展时间投票进行中',
      detail: {
        group: '建筑设计原理群',
        content: '助教小王：【投票】毕设展时间：同意周三的扣1，同意周五的扣2',
        voteOptions: ['周三', '周五'],
        deadline: '尽快'
      },
      action: '查看投票详情',
      highlight: ['助教小王']
    },
    {
      id: 'chen_card3',
      type: 'at',
      category: 'todo',
      title: '📌 @提及提醒',
      summary: '毕设中期答辩被@小陈',
      detail: {
        group: '建筑设计原理群',
        content: '导师刘老师：毕设中期答辩分组：@小陈 @小张 @小李 @小王 第四组，5月10日答辩',
        atMe: true
      },
      action: '查看答辩详情',
      highlight: ['@小陈', '导师刘老师']
    }
  ],
  lin: [
    {
      id: 'lin_card1',
      type: 'at',
      category: 'todo',
      title: '📌 @提及提醒',
      summary: '动漫搭子@小林',
      detail: {
        group: '动漫同好群',
        content: '小刚：@小林 你怎么消失了 最近都没一起追番了',
        atMe: true
      },
      action: '回复搭子消息',
      highlight: ['@小林', '小刚']
    },
    {
      id: 'lin_card2',
      type: 'birthday',
      category: 'birthday',
      title: '🎂 生日提醒',
      summary: '小美明天生日',
      detail: {
        contact: '小美',
        birthday: '明天',
        relationship: '搭子',
        blessing: '宝！生日快乐呀~明天必须一起过！追星搭子不能少你，新的一岁继续一起冲！',
        suggestion: '记得送祝福或准备礼物'
      },
      contact_name: '小美',
      action: '查看联系人',
      highlight: ['小美']
    }
  ],
  zhou: [
    {
      id: 'zhou_card1',
      type: 'channel',
      category: 'channel',
      title: '📚 吉他入门教程',
      summary: '学长@小周发送教程',
      detail: {
        group: '吉他爱好者群',
        content: '学长A：@小周 新手教程找到了 等下发你',
        channelName: '吉他入门教程包',
        channelId: 'ch_001',
        reason: '学长A分享了吉他教程',
        memberCount: 86
      },
      action: '查看教程内容',
      highlight: ['@小周', '学长A']
    },
    {
      id: 'zhou_card2',
      type: 'ddl',
      title: '📢 见面会提醒',
      summary: '新生见面会本周五14:00',
      detail: {
        group: '电子信息1班',
        content: '辅导员王老师：@全体成员 新生见面会本周五14:00，教学楼A101，必须参加',
        deadline: '本周五 14:00',
        location: '教学楼A101'
      },
      action: '添加到日历',
      highlight: ['辅导员王老师', '@全体成员']
    },
    {
      id: 'zhou_card3',
      type: 'at',
      category: 'todo',
      title: '📌 @提及提醒',
      summary: '小寒在吉他群@你',
      detail: {
        group: '吉他爱好者群',
        content: '小寒：@小周 你不是一直想学吉他嘛 一起加入呗',
        atMe: true
      },
      action: '查看详情',
      highlight: ['@小周', '小寒']
    },
    {
      id: 'zhou_card4',
      type: 'accepted_request',
      title: '📋 答应过的请求',
      summary: '老王借充电宝，别忘了',
      detail: {
        contact: '室友老王',
        content: '老王：小周 借我一下充电宝 我的没电了',
        sender: '老王',
        action_required: '给老王充电宝'
      },
      contact_name: '老王',
      action: '查看详情',
      highlight: ['老王']
    },
    {
      id: 'zhou_card5',
      type: 'unreplied_request',
      title: '📬 待回复的请求',
      summary: '室友C找你要笔记',
      detail: {
        contact: '室友老王',
        group: '新生群',
        content: '室友C：小周 有计算机导论的笔记吗',
        sender: '室友C',
        action_required: '回复室友C'
      },
      contact_name: '室友C',
      action: '回复',
      highlight: ['室友C']
    },
    {
      id: 'zhou_card6',
      type: 'buddy_cooling',
      title: '🔥 搭子降温提醒',
      summary: '你和吉他学长小寒好久没互动了',
      detail: {
        contact: '吉他学长小寒',
        relationship: '搭子',
        baselineInfo: '基线频率：每1天',
        lastInteraction: '最近互动：2天前',
        suggestedMessage: '嘿~最近忙啥呢？好久没一起弹吉他了'
      },
      contact_name: '小寒',
      action: '发消息',
      highlight: ['小寒']
    }
  ]
};

export const TIMELINE_EVENTS = {
  chen: [
    { id: 't1', type: 'ddl', time: '08:00', title: '数据库DDL提前', detail: '实验报告DDL提前到5月6日' },
    { id: 't2', type: 'vote', time: '10:00', title: '调课投票', detail: '同意周二请扣1，同意周四请扣2' },
    { id: 't3', type: 'at', time: '09:00', title: '分组项目', detail: '@小陈 第四组 5月10日答辩' }
  ],
  lin: [
    { id: 't1', type: 'at', time: '10:30', title: '搭子@你', detail: '小刚问你怎么消失了' },
    { id: 't2', type: 'birthday', time: '明天', title: '老王生日', detail: '记得送祝福' }
  ],
  zhou: [
    { id: 't1', type: 'channel', time: '11:30', title: '吉他教程', detail: '学长@小周发送教程' },
    { id: 't2', type: 'ddl', time: '10:00', title: '新生见面会', detail: '本周五14:00 教学楼A101' }
  ]
};

export const ANALYSIS_DATA = {
  chen: {
    currentScenario: {
      temperature: 45,
      baseline: 60,
      reason: 'DDL提前通知淹没在大量闲聊中，用户错过了重要时间节点',
      reasoningChain: [
        { input: 'CHAT_DETAILS[1].messages包含128条消息', triggerNode: 'event_ddl' },
        { input: 'DDL消息(id=55)在消息中间位置，被闲聊包围', output: 'DDL被淹没' },
        { input: '未读数99+，用户未看到该消息', output: '可能错过DDL' },
        { input: 'QBUGDY识别到event_ddl节点温度异常', output: '触发DDL提醒卡片' },
        { input: '推送提醒给用户', output: '用户及时获知' }
      ],
      relatedContacts: ['助教小王', '群主刘老师']
    }
  },
  lin: {
    currentScenario: {
      temperature: 38,
      baseline: 50,
      reason: '动漫搭子小刚多次@小林但未被回复，搭子关系降温中',
      reasoningChain: [
        { input: '小刚在群里@小林两次(id=50,55)', triggerNode: '动漫搭子小刚' },
        { input: '小林最近未在群里活跃', output: '小刚感知到疏远' },
        { input: 'CHAT_DETAILS[1]包含118条消息', output: '消息噪音大' },
        { input: '@消息被淹没在闲聊中', output: '小林未及时回复' },
        { input: '关系温度持续下降', output: '触发搭子降温提醒' }
      ],
      relatedContacts: ['小刚', '小美', '小雪']
    }
  },
  zhou: {
    currentScenario: {
      temperature: 55,
      baseline: 50,
      reason: '吉他群学长@小周发送入门教程，但被淹没在群消息中',
      reasoningChain: [
        { input: '新生群有118条消息，吉他群有28条', triggerNode: '吉他群学长' },
        { input: '学长A在id=15时@小周发送教程', output: '教程发送成功' },
        { input: '但之前有大量闲聊消息', output: '@消息不够突出' },
        { input: '小周可能未注意到该消息', output: '错过教程' },
        { input: 'QBUGDY识别到channel事件', output: '推送教程推荐卡片' }
      ],
      relatedContacts: ['学长A', '阿杰', '学姐C']
    }
  }
};

export const RANKING_DATA = {
  chen: {
    weekly: { ddl: 8, vote: 3, at: 5 },
    monthly: { ddl: 32, vote: 12, at: 18 },
    unread: 99
  },
  lin: {
    weekly: { ddl: 5, vote: 2, at: 8 },
    monthly: { ddl: 20, vote: 8, at: 35 },
    unread: 99
  },
  zhou: {
    weekly: { ddl: 6, vote: 1, at: 4 },
    monthly: { ddl: 25, vote: 5, at: 15 },
    unread: 99
  }
};

export default {
  ROLES,
  GRAPH_DATA,
  CHAT_LISTS,
  CHAT_DETAILS,
  QBUGDY_CARDS,
  RANKING_DATA,
  ANALYSIS_DATA
};

// ============ 好友动态数据 (QQ空间风格) ============
export const DYNAMIC_DATA = {
  chen: [
    {
      id: 'dyn_001',
      author: '手绘搭子小王',
      avatar: '🎨',
      time: '2小时前',
      content: '终于完成了一张建筑草图！红环配法卡真的绝了🎉',
      images: [],
      likes: 15,
      comments: 3
    },
    {
      id: 'dyn_002',
      author: '毕设搭子小李',
      avatar: '📐',
      time: '昨天',
      content: '毕设终于答辩完了！不管结果如何，这几个月都值了。接下来要好好放松一下~',
      images: ['📐'],
      likes: 28,
      comments: 12
    },
    {
      id: 'dyn_003',
      author: '室友小张',
      avatar: '👦',
      time: '3天前',
      content: '专教闭关 day30，今天终于把建筑分析图画完了！累但值得💪',
      images: ['📐'],
      likes: 8,
      comments: 2
    },
    {
      id: 'dyn_004',
      author: '同学小刘',
      avatar: '🧑',
      time: '4天前',
      content: '有没有人一起组队参加城市设计竞赛啊，组队dd！',
      images: [],
      likes: 5,
      comments: 6
    },
    {
      id: 'dyn_005',
      author: '顾芳',
      avatar: '👩‍🔬',
      time: '1周前',
      content: '保研夏令营通过了！感谢这一路帮助过我的人，接下来继续加油~',
      images: ['🎓'],
      likes: 42,
      comments: 15
    },
    {
      id: 'dyn_006',
      author: '老陈',
      avatar: '🏀',
      time: '1周前',
      content: '周末约球，有人来吗？篮球场上见！',
      images: [],
      likes: 6,
      comments: 4
    }
  ],
  lin: [
    {
      id: 'dyn_001',
      author: '动漫搭子小刚',
      avatar: '🎨',
      time: '1小时前',
      content: '新番更新了！这集打戏太燃了，直接封神🔥',
      images: ['🎬'],
      likes: 22,
      comments: 8
    },
    {
      id: 'dyn_002',
      author: '羽毛球搭子小美',
      avatar: '🏸',
      time: '3小时前',
      content: '今天羽毛球打了两小时，爽！流汗的感觉太解压了🏸',
      images: ['💪'],
      likes: 14,
      comments: 3
    },
    {
      id: 'dyn_003',
      author: '闺蜜小雪',
      avatar: '👧',
      time: '昨天',
      content: '周末约饭！发现了一家超好吃的日料，必须推荐给你们~',
      images: ['🍣'],
      likes: 35,
      comments: 12
    },
    {
      id: 'dyn_004',
      author: '老王',
      avatar: '🎂',
      time: '2天前',
      content: '生日快乐！今天和朋友一起过了个超开心的生日~谢谢大家的祝福！',
      images: ['🎂', '🎁'],
      likes: 66,
      comments: 28
    },
    {
      id: 'dyn_005',
      author: '小亮',
      avatar: '🎵',
      time: '3天前',
      content: '演唱会抢票成功！终于能去看我偶像的现场了，激动！',
      images: ['🎤'],
      likes: 45,
      comments: 18
    },
    {
      id: 'dyn_006',
      author: '小范',
      avatar: '👾',
      time: '4天前',
      content: '新游戏上线了，有没有人一起组队开黑？',
      images: [],
      likes: 12,
      comments: 7
    }
  ],
  zhou: [
    {
      id: 'dyn_001',
      author: '吉他学长小寒',
      avatar: '🎸',
      time: '30分钟前',
      content: '今天练了《晴天》前奏，终于能完整弹下来了，感动！🎸',
      images: ['🎸'],
      likes: 18,
      comments: 5
    },
    {
      id: 'dyn_002',
      author: '阿琴学姐',
      avatar: '🎵',
      time: '2小时前',
      content: '组了个乐队缺吉他手，有兴趣的学弟学妹可以来试试呀~',
      images: ['🎹', '🥁'],
      likes: 25,
      comments: 12
    },
    {
      id: 'dyn_003',
      author: '婷婷',
      avatar: '📷',
      time: '昨天',
      content: '漫展打卡！今天见到了好多cosplay的小姐姐，拍照拍到手软📸',
      images: ['🎭', '✨'],
      likes: 48,
      comments: 16
    },
    {
      id: 'dyn_004',
      author: '室友老王',
      avatar: '🎮',
      time: '2天前',
      content: '永劫无间终于上铂金了！这游戏真的太上头了🎮',
      images: [],
      likes: 14,
      comments: 6
    },
    {
      id: 'dyn_005',
      author: '高中好友浩子',
      avatar: '🏀',
      time: '3天前',
      content: '高中篮球赛拿了年级第三！兄弟们太给力了🏀',
      images: ['🏆'],
      likes: 38,
      comments: 15
    },
    {
      id: 'dyn_006',
      author: '学姐小陈',
      avatar: '👩‍🎓',
      time: '1周前',
      content: '大创项目中期答辩顺利通过！感谢团队每一个人的努力~',
      images: ['🎓'],
      likes: 42,
      comments: 10
    }
  ]
};

// ============ 频道数据 ============
export const CHANNEL_DATA = {
  chen: [
    {
      id: 'ch_001',
      name: '建筑作品集分享',
      avatar: '📐',
      description: '建筑学作品集交流，互相点评、互相学习',
      memberCount: 2847,
      category: '学习'
    },
    {
      id: 'ch_002',
      name: '手绘打卡群',
      avatar: '🎨',
      description: '每日一画，手绘能力稳步提升',
      memberCount: 1562,
      category: '兴趣'
    },
    {
      id: 'ch_003',
      name: '专教室预约助手',
      avatar: '🏛️',
      description: '实时共享专教座位信息，预约不用排队',
      memberCount: 956,
      category: '工具'
    },
    {
      id: 'ch_004',
      name: 'BIM技术交流群',
      avatar: '💻',
      description: 'BIM建模技术交流，revit和archicad都有',
      memberCount: 3201,
      category: '学习'
    }
  ],
  lin: [
    {
      id: 'ch_001',
      name: '二次元同好会',
      avatar: '🎭',
      description: 'ACG爱好者的天堂，聊番、聊漫、聊手办',
      memberCount: 5234,
      category: '兴趣'
    },
    {
      id: 'ch_002',
      name: '校园美食地图',
      avatar: '🍜',
      description: '发现身边美食，分享探店心得',
      memberCount: 1892,
      category: '生活'
    },
    {
      id: 'ch_003',
      name: '羽毛球约球群',
      avatar: '🏸',
      description: '周末约球，球友dd',
      memberCount: 678,
      category: '运动'
    },
    {
      id: 'ch_004',
      name: '学生会活动发布',
      avatar: '🎪',
      description: '校园活动一手掌握，参与有奖',
      memberCount: 2105,
      category: '校园'
    }
  ],
  zhou: [
    {
      id: 'ch_001',
      name: '吉他入门指南',
      avatar: '🎸',
      description: '新手吉他手聚集地，分享教程、答疑解惑',
      memberCount: 1589,
      category: '兴趣'
    },
    {
      id: 'ch_002',
      name: '新生互助联盟',
      avatar: '🎓',
      description: '学长学姐带你玩转大学生活',
      memberCount: 4521,
      category: '校园'
    },
    {
      id: 'ch_003',
      name: '漫展情报站',
      avatar: '✨',
      description: '最新漫展资讯，同人创作分享',
      memberCount: 2356,
      category: '兴趣'
    },
    {
      id: 'ch_004',
      name: '电赛交流区',
      avatar: '⚡',
      description: '电子设计竞赛交流，资源共享',
      memberCount: 892,
      category: '学习'
    }
  ]
};

// ============ 好友详细信息数据 ============
export const CONTACT_PROFILES = {
  chen: {
    '爸爸 👨': {
      avatar: '👨',
      relationship: '家人',
      interestTags: ['钓鱼', '下棋'],
      recentEvents: [],
      qqEcosystem: {
        gaming: [],
        video: ['新闻联播', '棋王争霸'],
        music: ['京剧名段', '经典老歌'],
        reading: ['钓鱼杂志', '象棋残局']
      },
      signature: '周末有空一起钓鱼吗？'
    },
    '妈妈 👩': {
      avatar: '👩',
      relationship: '家人',
      interestTags: ['烹饪', '养生'],
      recentEvents: [],
      qqEcosystem: {
        gaming: [],
        video: ['养生堂', '舌尖上的中国'],
        music: ['广场舞神曲'],
        reading: ['健康食谱', '中医养生']
      },
      signature: '记得按时吃饭，早点休息'
    },
    '手绘搭子小王 🎨': {
      avatar: '🎨',
      relationship: '搭子',
      interestTags: ['建筑设计', '手绘', '城市摄影'],
      recentEvents: ['发朋友圈：终于完成了一张建筑草图！'],
      qqEcosystem: {
        gaming: [],
        video: ['建筑纪录片', '设计类综艺'],
        music: ['轻音乐'],
        reading: ['建筑杂志', '手绘教程']
      },
      signature: '上分冲冲冲！新赛季冲起来'
    },
    '考研党小李 📚': {
      avatar: '📚',
      relationship: '搭子',
      interestTags: ['考研', '健身', '王者荣耀'],
      recentEvents: ['考研终于结束了'],
      qqEcosystem: {
        gaming: ['王者荣耀 - 星耀段位'],
        video: ['考研直播', 'TED演讲'],
        music: ['学习专注白噪音', '纯音乐'],
        reading: ['考研政治', '高数辅导书', '线性代数']
      },
      signature: '闭关修炼中，勿扰'
    },
    '室友小张 👦': {
      avatar: '👦',
      relationship: '室友',
      interestTags: ['编程', '数据库', '后端开发'],
      recentEvents: ['图书馆闭关 day30'],
      qqEcosystem: {
        gaming: ['Steam独立游戏', '我的世界'],
        video: ['编程教学视频', '科幻电影'],
        music: ['电子音乐', '赛博朋克OST'],
        reading: ['算法导论', '深入理解计算机系统', '数据库系统概论']
      },
      signature: '今天又把数据库调通了！'
    },
    '小刘 🧑': {
      avatar: '🧑',
      relationship: '同学',
      interestTags: ['操作系统', '算法', 'C语言'],
      recentEvents: [],
      qqEcosystem: {
        gaming: ['LOL - 青铜段位'],
        video: ['操作系统教程', '纪录片'],
        music: ['轻音乐', '古典音乐'],
        reading: ['操作系统概念', 'C Primer Plus', '数据结构与算法']
      },
      signature: '刷题刷题！'
    },
    '顾芳 👩‍🔬': {
      avatar: '👩‍🔬',
      relationship: '同学',
      interestTags: ['算法', '保研', '学术'],
      recentEvents: ['保研夏令营通过了'],
      qqEcosystem: {
        gaming: [],
        video: ['学术会议直播', 'Nature纪录片'],
        music: ['古典音乐'],
        reading: ['顶会论文', '机器学习', '深度学习']
      },
      signature: 'paper发了吗'
    },
    '老陈 🏀': {
      avatar: '🏀',
      relationship: '好友',
      interestTags: ['篮球', '高中同学'],
      recentEvents: [],
      qqEcosystem: {
        gaming: ['2K系列', '街头篮球'],
        video: ['NBA直播', '篮球纪录片'],
        music: ['嘻哈音乐', '篮球之神'],
        reading: ['篮球杂志']
      },
      signature: '周末约球，有兴趣的call我'
    }
  },
  lin: {
    '闺蜜小雪 👧': {
      avatar: '👧',
      relationship: '闺蜜',
      interestTags: ['追星', '演唱会', '日料'],
      recentEvents: ['周末约饭'],
      qqEcosystem: {
        gaming: ['偶像梦幻祭', '暖暖换装'],
        video: ['韩剧', '泰剧', '偶像综艺'],
        music: ['k-pop', '演唱会现场', '新专辑发布'],
        reading: ['偶像杂志', '娱乐八卦']
      },
      signature: '姐妹们冲！今晚演唱会见'
    },
    '小美 🏸': {
      avatar: '🏸',
      relationship: '搭子',
      interestTags: ['动漫', '追星', '演唱会'],
      recentEvents: ['明天生日！'],
      qqEcosystem: {
        gaming: ['偶像梦幻祭', '原神'],
        video: ['新番更新', '演唱会录播', '偶像综艺'],
        music: ['演唱会曲目', 'k-pop', '应援曲'],
        reading: ['周边资讯', '应援教程']
      },
      signature: '宝！生日快乐呀~'
    },
    '动漫搭子小刚 🎨': {
      avatar: '🎨',
      relationship: '搭子',
      interestTags: ['羽毛球', '健身', 'NBA'],
      recentEvents: ['发健身照'],
      qqEcosystem: {
        gaming: ['NBA 2K', 'FIFA', '健身游戏'],
        video: ['NBA比赛', '健身视频', '健身纪录片'],
        music: ['健身BGM', '硬核摇滚', 'NBA主题曲'],
        reading: ['健身指南', '营养学']
      },
      signature: '今天练背日，冲！'
    },
    '羽毛球搭子小美 🏸': {
      avatar: '🏸',
      relationship: '搭子',
      interestTags: ['羽毛球', '学生会', '策划'],
      recentEvents: [],
      qqEcosystem: {
        gaming: ['羽毛球游戏'],
        video: ['羽毛球比赛', '活动策划视频'],
        music: ['活动主题曲', '团体合唱'],
        reading: ['活动策划案', '学生会工作手册']
      },
      signature: '最近好忙啊，学生会活动太多了'
    },
    '小亮 🎵': {
      avatar: '🎵',
      relationship: '同好',
      interestTags: ['音乐节', '摇滚', 'livehouse'],
      recentEvents: ['演唱会抢票成功'],
      qqEcosystem: {
        gaming: [],
        video: ['音乐节直播', '乐队综艺'],
        music: ['痛仰乐队', '新裤子', '痛仰 - 西湖', 'livehouse现场曲'],
        reading: ['音乐杂志', '乐评文章']
      },
      signature: '下周的痛仰，必须去！'
    },
    '小范 👾': {
      avatar: '👾',
      relationship: '同好',
      interestTags: ['二次元', '手办', '动漫展'],
      recentEvents: [],
      qqEcosystem: {
        gaming: ['二次元手游', '乙女游戏'],
        video: ['新番动画', '手办开箱', '漫展直播'],
        music: ['动漫OP/ED', 'JPOP', 'Vocaloid'],
        reading: ['漫画单行本', '轻小说', '设定集']
      },
      signature: '手办柜又要填满了...'
    },
    '潇潇 👩': {
      avatar: '👩',
      relationship: '好友',
      interestTags: ['高中同学', '美妆', '旅行'],
      recentEvents: [],
      qqEcosystem: {
        gaming: ['旅行青蛙', '换装游戏'],
        video: ['美妆教程', '旅行vlog', '韩剧'],
        music: ['流行音乐', '美妆博主BGM'],
        reading: ['美妆杂志', '旅行攻略']
      },
      signature: '又发现了一个超美的地方！'
    },
    '阿兰 🧑‍💼': {
      avatar: '🧑‍💼',
      relationship: '同学',
      interestTags: ['学生会', '策划活动', '辩论'],
      recentEvents: [],
      qqEcosystem: {
        gaming: [],
        video: ['辩论赛', 'TED演讲', '策划案分享会'],
        music: ['演讲背景音乐', '正能量歌曲'],
        reading: ['活动策划', '公共演讲', '管理学']
      },
      signature: '下周的辩论赛准备中'
    }
  },
  zhou: {
    '室友老王 🎮': {
      avatar: '🎮',
      relationship: '室友',
      interestTags: ['游戏', '永劫无间', '二次元'],
      recentEvents: [],
      qqEcosystem: {
        gaming: ['永劫无间 - 铂金段位', '原神', 'CS:GO'],
        video: ['永劫无间赛事', '二次元番剧'],
        music: ['游戏BGM', '二次元OP'],
        reading: ['游戏攻略', '二次元资讯']
      },
      signature: '永劫无间走起！今晚开黑'
    },
    '吉他学长小寒 🎸': {
      avatar: '🎸',
      relationship: '搭子',
      interestTags: ['吉他', '民谣', '校园歌手大赛'],
      recentEvents: ['今天练了《晴天》前奏'],
      qqEcosystem: {
        gaming: [],
        video: ['吉他教学视频', '音乐综艺'],
        music: ['周杰伦歌曲', '民谣吉他曲', '校园歌手live'],
        reading: ['吉他教程', '和弦图谱', '乐理基础']
      },
      signature: 'F和弦终于能按响了，继续加油'
    },
    '阿琴学姐 🎵': {
      avatar: '🎵',
      relationship: '搭子',
      interestTags: ['吉他', '乐队', '原创音乐'],
      recentEvents: ['组了个乐队缺吉他手'],
      qqEcosystem: {
        gaming: [],
        video: ['乐队演出视频', '音乐节直播'],
        music: ['原创歌曲', '乐队排练曲', '民谣歌曲'],
        reading: ['作曲教程', '编曲软件教程', '歌词创作']
      },
      signature: '乐队招募新成员，有兴趣的学弟学妹来试试'
    },
    '婷婷 📷': {
      avatar: '📷',
      relationship: '同好',
      interestTags: ['摄影', 'PS', 'LR'],
      recentEvents: ['漫展打卡'],
      qqEcosystem: {
        gaming: [],
        video: ['摄影教程', '漫展cosplay视频'],
        music: ['轻音乐', '摄影背景BGM'],
        reading: ['摄影构图', 'PS教程', 'LR调色教程', '器材评测']
      },
      signature: '今天的漫展拍照拍到手软'
    },
    '高中好友浩子 🏀': {
      avatar: '🏀',
      relationship: '好友',
      interestTags: ['高中同学', '篮球'],
      recentEvents: ['高中篮球赛拿了年级第三'],
      qqEcosystem: {
        gaming: ['2K系列', '街头篮球'],
        video: ['NBA直播', '篮球集锦'],
        music: ['篮球主题歌', '嘻哈'],
        reading: ['篮球战术', '球星传记']
      },
      signature: '想当年一起打球的时光'
    },
    '班长小周 🧑‍💼': {
      avatar: '🧑‍💼',
      relationship: '同学',
      interestTags: ['班级管理', '组织活动'],
      recentEvents: [],
      qqEcosystem: {
        gaming: [],
        video: ['学生会会议', '活动策划分享'],
        music: ['学生会团建歌曲'],
        reading: ['班级通知', '活动策划案', '管理学']
      },
      signature: '@全体成员 请大家注意查收通知'
    }
  }
};

// ============ 频道帖子数据 ============
export const CHANNEL_POSTS = {
  chen: {
    'ch_001': [
      { id: 'post_chen_001_1', author: '学长A', avatar: '👨‍🎓', time: '1小时前', content: '今年保研名额出来了吗？求分享信息', likes: 12, comments: 8, tags: ['保研', 'CS'] },
      { id: 'post_chen_001_2', author: '学姐B', avatar: '👩‍🎓', time: '3小时前', content: '分享一下我的夏令营经历：浙大、上交、复旦都过了，给大家沾沾好运~', likes: 45, comments: 23, tags: ['经验分享', '夏令营'] },
      { id: 'post_chen_001_3', author: '小C', avatar: '🧑', time: '5小时前', content: '联系导师有什么技巧吗？感觉邮件都石沉大海', likes: 8, comments: 15, tags: ['导师', '联系'] },
      { id: 'post_chen_001_4', author: '学弟D', avatar: '👦', time: '昨天', content: '求助！数据结构该怎么复习啊，感觉内容太多了', likes: 5, comments: 12, tags: ['复习', '数据结构'] },
      { id: 'post_chen_001_5', author: '学长E', avatar: '👨', time: '2天前', content: '预推免经验贴：我是如何从双非上岸华五的', likes: 89, comments: 42, tags: ['预推免', '经验'] }
    ],
    'ch_002': [
      { id: 'post_chen_002_1', author: '小王', avatar: '🎮', time: '刚刚', content: '今晚有人开黑吗？差一个打野位', likes: 6, comments: 4, tags: ['约战', '开黑'] },
      { id: 'post_chen_002_2', author: '大神A', avatar: '👑', time: '1小时前', content: '分享一下我的打野思路：从开局到结束全流程教学', likes: 156, comments: 67, tags: ['教学', '打野'] },
      { id: 'post_chen_002_3', author: '萌新B', avatar: '🐣', time: '2小时前', content: '求带！第一次玩这个游戏，有没有好心人教教', likes: 3, comments: 8, tags: ['新手', '求带'] },
      { id: 'post_chen_002_4', author: '战绩怪', avatar: '🏆', time: '昨天', content: '今天终于上王者了！连胜12把，记录一下', likes: 28, comments: 15, tags: ['战绩', '王者'] },
      { id: 'post_chen_002_5', author: '主播C', avatar: '🎬', time: '3天前', content: '今晚8点直播教学，感兴趣的来！', likes: 45, comments: 23, tags: ['直播', '教学'] }
    ],
    'ch_003': [
      { id: 'post_chen_003_1', author: '学霸A', avatar: '📚', time: '30分钟前', content: '三楼靠窗座位已预约，有需要的自取', likes: 2, comments: 1, tags: ['座位', '预约'] },
      { id: 'post_chen_003_2', author: '夜猫子B', avatar: '🦉', time: '2小时前', content: '图书馆24小时区现在人少，想来的抓紧', likes: 5, comments: 3, tags: ['座位', '24小时'] },
      { id: 'post_chen_003_3', author: '早起鸟C', avatar: '🐦', time: '昨天', content: '明天早上7点去图书馆，有人一起吗？', likes: 3, comments: 5, tags: ['早起', '约伴'] },
      { id: 'post_chen_003_4', author: '管理员', avatar: '👮', time: '3天前', content: '通知：本周图书馆开放时间有调整，请注意查看', likes: 15, comments: 8, tags: ['通知', '开放时间'] }
    ],
    'ch_004': [
      { id: 'post_chen_004_1', author: '算法侠', avatar: '💻', time: '刚刚', content: '【每日一题】第365天：给定一个数组，找出其中和为target的两个数...', likes: 23, comments: 45, tags: ['每日一题', '数组'] },
      { id: 'post_chen_004_2', author: '刷题打卡', avatar: '📅', time: '1小时前', content: 'Day 100打卡！终于刷满100天了，给自己鼓个掌', likes: 89, comments: 56, tags: ['打卡', '100天'] },
      { id: 'post_chen_004_3', author: '新人A', avatar: '🐣', time: '3小时前', content: '刚入门刷题，有没有一起打卡的小伙伴？', likes: 15, comments: 22, tags: ['新人', '打卡'] },
      { id: 'post_chen_004_4', author: '大厂HR', avatar: '🏢', time: '昨天', content: '分享一些大厂面试算法题库，持续更新中...', likes: 234, comments: 89, tags: ['面试', '大厂'] },
      { id: 'post_chen_004_5', author: '学长B', avatar: '👨‍🎓', time: '2天前', content: '动态规划专题整理好了，需要的自取', likes: 178, comments: 67, tags: ['DP', '专题'] },
      { id: 'post_chen_004_6', author: '小白C', avatar: '🐰', time: '3天前', content: '看不懂递归怎么办，有没有好的教程推荐？', likes: 8, comments: 34, tags: ['递归', '教程'] }
    ]
  },
  lin: {
    'ch_001': [
      { id: 'post_lin_001_1', author: '追番达人', avatar: '🎭', time: '刚刚', content: '新番更新！这季度有几部黑马番，超好看', likes: 34, comments: 28, tags: ['新番', '推荐'] },
      { id: 'post_lin_001_2', author: '手办收藏家', avatar: '🎨', time: '1小时前', content: '分享一下最近入手的手办，真的太精致了', likes: 67, comments: 45, tags: ['手办', '收藏'] },
      { id: 'post_lin_001_3', author: '漫展情报员', avatar: '📍', time: '3小时前', content: '好消息！下周漫展门票开售了，手慢无', likes: 89, comments: 56, tags: ['漫展', '票务'] },
      { id: 'post_lin_001_4', author: 'COSER小A', avatar: '✨', time: '昨天', content: '漫展返图来了，快来看看有没有你', likes: 123, comments: 78, tags: ['cos', '返图'] },
      { id: 'post_lin_001_5', author: '同好B', avatar: '🎮', time: '2天前', content: '有人一起组队打原神吗？新手求带', likes: 15, comments: 23, tags: ['原神', '组队'] }
    ],
    'ch_002': [
      { id: 'post_lin_002_1', author: '美食探店', avatar: '🍜', time: '刚刚', content: '发现了一家超好吃的日料，强烈推荐！', likes: 45, comments: 18, tags: ['日料', '推荐'] },
      { id: 'post_lin_002_2', author: '小吃货', avatar: '🍕', time: '2小时前', content: '学校后街新开了一家奶茶店，第二杯半价', likes: 23, comments: 12, tags: ['奶茶', '优惠'] },
      { id: 'post_lin_002_3', author: '探店达人', avatar: '📷', time: '昨天', content: '今天去打卡了那家网红餐厅，排队两小时值了', likes: 56, comments: 34, tags: ['网红', '排队'] },
      { id: 'post_lin_002_4', author: '吃货A', avatar: '🍔', time: '3天前', content: '求推荐学校附近好吃不贵的早餐店', likes: 8, comments: 25, tags: ['早餐', '求助'] },
      { id: 'post_lin_002_5', author: '省钱达人', avatar: '💰', time: '5天前', content: '分享一个美食优惠券群，想进的call我', likes: 34, comments: 45, tags: ['优惠', '福利'] }
    ],
    'ch_003': [
      { id: 'post_lin_003_1', author: '球友A', avatar: '🏸', time: '刚刚', content: '周六下午有人约球吗？新手也可以', likes: 5, comments: 8, tags: ['约球', '周六'] },
      { id: 'post_lin_003_2', author: '运动达人', avatar: '💪', time: '1小时前', content: '分享一下我的羽毛球装备，新手可以参考', likes: 23, comments: 15, tags: ['装备', '分享'] },
      { id: 'post_lin_003_3', author: '教练B', avatar: '🏅', time: '昨天', content: '教球多年，分享一些新手常见错误', likes: 67, comments: 34, tags: ['教学', '技巧'] },
      { id: 'post_lin_003_4', author: '小球友', avatar: '🐣', time: '2天前', content: '刚学羽毛球三个月，有没有人一起练习', likes: 8, comments: 12, tags: ['新手', '练习'] }
    ],
    'ch_004': [
      { id: 'post_lin_004_1', author: '活动策划', avatar: '🎪', time: '刚刚', content: '【通知】下周校园歌手大赛初赛，请各位选手做好准备', likes: 34, comments: 12, tags: ['通知', '歌手大赛'] },
      { id: 'post_lin_004_2', author: '参赛选手', avatar: '🎤', time: '2小时前', content: '有没有一起备赛的小伙伴？求组队练习', likes: 15, comments: 23, tags: ['备赛', '组队'] },
      { id: 'post_lin_004_3', author: '往届冠军', avatar: '🏆', time: '昨天', content: '分享一下我的参赛经验，希望能帮到大家', likes: 89, comments: 45, tags: ['经验', '分享'] },
      { id: 'post_lin_004_4', author: '围观群众', avatar: '👀', time: '3天前', content: '去年的歌手大赛现场太燃了，今年继续支持', likes: 45, comments: 18, tags: ['回顾', '围观'] },
      { id: 'post_lin_004_5', author: '学生会成员', avatar: '📋', time: '上周', content: '志愿者招募中！想参与活动组织的同学报名', likes: 56, comments: 34, tags: ['志愿者', '招募'] }
    ]
  },
  zhou: {
    'ch_001': [
      { id: 'post_zhou_001_1', author: '吉他学长小寒', avatar: '🎸', time: '刚刚', content: '今天学了F和弦，虽然按不响但感觉有进步了！', likes: 12, comments: 8, tags: ['练琴', 'F和弦'] },
      { id: 'post_zhou_001_2', author: '阿琴学姐', avatar: '🎵', time: '1小时前', content: '新手必看！吉他入门教程合集，收藏起来慢慢学', likes: 89, comments: 34, tags: ['教程', '入门'] },
      { id: 'post_zhou_001_3', author: '爬格子选手', avatar: '🐌', time: '3小时前', content: '爬格子第30天打卡，从开始的生无可恋到现在的渐入佳境', likes: 45, comments: 23, tags: ['打卡', '爬格子'] },
      { id: 'post_zhou_001_4', author: '和弦小白', avatar: '🐣', time: '昨天', content: '求教！C和弦总是按不响怎么办，有没有技巧', likes: 15, comments: 28, tags: ['求助', 'C和弦'] },
      { id: 'post_zhou_001_5', author: '民谣爱好者', avatar: '🎙️', time: '2天前', content: '推荐几首适合新手的弹唱曲目：童年、彩虹、董小姐', likes: 67, comments: 45, tags: ['推荐', '弹唱'] },
      { id: 'post_zhou_001_6', author: '乐理老师', avatar: '📖', time: '3天前', content: '零基础学吉他要先学乐理吗？这里给你答案', likes: 123, comments: 56, tags: ['乐理', '新手'] }
    ],
    'ch_002': [
      { id: 'post_zhou_002_1', author: '带班学长', avatar: '👨‍🎓', time: '刚刚', content: '【新生必看】入学物品清单，建议收藏', likes: 234, comments: 89, tags: ['攻略', '入学'] },
      { id: 'post_zhou_002_2', author: '学姐A', avatar: '👩‍🎓', time: '1小时前', content: '选课指南来了！哪些课值得抢，哪些要避开', likes: 178, comments: 123, tags: ['选课', '指南'] },
      { id: 'post_zhou_002_3', author: '新生B', avatar: '🐣', time: '3小时前', content: '刚报到，有什么需要注意的吗？求学长学姐指导', likes: 45, comments: 67, tags: ['求助', '新生'] },
      { id: 'post_zhou_002_4', author: '社团招新', avatar: '🎯', time: '昨天', content: '各社团招新群汇总，需要的进', likes: 345, comments: 156, tags: ['社团', '招新'] },
      { id: 'post_zhou_002_5', author: '生活达人', avatar: '🏠', time: '2天前', content: '校园周边生活配套介绍，吃喝玩乐全覆盖', likes: 89, comments: 45, tags: ['生活', '攻略'] }
    ],
    'ch_003': [
      { id: 'post_zhou_003_1', author: '漫展情报站', avatar: '✨', time: '刚刚', content: '重磅消息！本月漫展嘉宾阵容公布', likes: 567, comments: 234, tags: ['漫展', '嘉宾'] },
      { id: 'post_zhou_003_2', author: 'COSER小A', avatar: '🎭', time: '2小时前', content: '漫展cos服制作教程，新手也能学会', likes: 189, comments: 78, tags: ['cos', '教程'] },
      { id: 'post_zhou_003_3', author: '同好B', avatar: '🌟', time: '昨天', content: '有没有人一起组队去漫展？求搭子', likes: 67, comments: 89, tags: ['组队', '约伴'] },
      { id: 'post_zhou_003_4', author: '摄影大大', avatar: '📷', time: '2天前', content: '漫展拍摄技巧分享，拍出好照片的秘诀', likes: 234, comments: 112, tags: ['摄影', '技巧'] },
      { id: 'post_zhou_003_5', author: '手办收藏家', avatar: '🎁', time: '3天前', content: '分享一下我收藏的手办，都很稀有哦', likes: 345, comments: 167, tags: ['手办', '收藏'] }
    ],
    'ch_004': [
      { id: 'post_zhou_004_1', author: '电赛老司机', avatar: '⚡', time: '刚刚', content: '电赛培训报名开始了，有兴趣的同学不要错过', likes: 45, comments: 23, tags: ['电赛', '培训'] },
      { id: 'post_zhou_004_2', author: '技术宅', avatar: '💻', time: '1小时前', content: '分享一些电赛常用电路模块资料，收藏备用', likes: 156, comments: 67, tags: ['资料', '电路'] },
      { id: 'post_zhou_004_3', author: '编程达人', avatar: '⌨️', time: '3小时前', content: '电赛中STM32编程技巧，新手向', likes: 89, comments: 45, tags: ['编程', 'STM32'] },
      { id: 'post_zhou_004_4', author: '参赛选手A', avatar: '🏆', time: '昨天', content: '去年参赛经验分享，含金量满满', likes: 178, comments: 89, tags: ['经验', '分享'] },
      { id: 'post_zhou_004_5', author: '学弟B', avatar: '🐣', time: '2天前', content: '零基础想参加电赛，从哪里开始学？', likes: 34, comments: 56, tags: ['求助', '入门'] },
      { id: 'post_zhou_004_6', author: '指导老师', avatar: '👨‍🏫', time: '3天前', content: '电赛选题建议，看看哪个方向适合你', likes: 234, comments: 112, tags: ['选题', '指导'] }
    ]
  }
};
