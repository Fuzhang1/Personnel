let Koa = require('koa')
let Router = require('koa-router')
let server = require('koa-static')
const session = require('koa-session')

// koa-body新写法
const { koaBody } = require('koa-body')
const app = new Koa()
const router = new Router()
app.keys = ['this is wuhan', 'fristDay']

const fs = require('fs')
const path = require('path')
const { parse } = require('path')

// 配置session
app.use(server("./static"))
const SessionStore = {};
const session_config = {
    key: 'koa:sess',
    /**  cookie的key。 (默认是 koa:sess) */
    maxAge: 86400000,
    /**  session 过期时间，以毫秒ms为单位计算 。 */
    autoCommit: true,
    /** 自动提交到响应头。(默认是 true) */
    overwrite: true,
    /** 是否允许重写 。(默认是 true) */
    httpOnly: true,
    /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
    signed: true,
    /** 是否签名。(默认是 true) */
    rolling: false,
    /** 是否每次响应时刷新Session的有效期。(默认是 false) */
    renew: false,
    /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
    secure: false,
    store: {
        get: (key) => {
            return SessionStore[key];
        },
        set: (key, value, maxAge) => {
            // console.log("set", key, value, maxAge);
            //存储在Node.js内存中，进程结束就没了。最合适的是存储在三方体系中，比如redis
            SessionStore[key] = value;
        },
        destroy: () => {
            //  /api/user/logout
            SessionStore[key] = null;
            console.log("desctroy");
        },
    },
}

app.use(session(session_config, app))
const usernameList = ['root', 'admin']
const passwordList = ['123456', '123456']

async function toLogin(ctx, next) {
    // toLogin用于校验登录
    //校验无数据传来与，传来数据格式不对的情况
    if (ctx.request.body !== undefined && "username" in ctx.request.body && "password" in ctx.request.body) {
        const { username, password } = ctx.request.body
        let flag = true
        for (let i = 0; i < usernameList.length; i++) {
            if (username === usernameList[i] && password === passwordList[i]) {
                ctx.body = { code: 1, message: '登录成功' }
                ctx.session.user = username
                flag = false
                break
            }
        }
        if (flag) ctx.body = { code: 0, message: '密码错误' }
        await next();
    } else {
        console.log('登录不合法', ctx.request.body);
        ctx.body = { code: -1, message: '不合法' }
        return
    }

}

async function toLogout(ctx, next) {
    //toLogout用于退出登录
    if (ctx.session.user !== undefined && ctx.session.user !== null) {
        ctx.session.user = null
        ctx.session.infoList = null
        ctx.body = { code: 1, message: '退出成功' }
    } else {
        ctx.body = { code: 0, message: '退出失败' }
    }
    await next()
}

async function isLogin(ctx, next) {
    //用于判null和undefined
    if (!!ctx.session.user) {
        ctx.body = { code: 1, message: "已经登录", user: ctx.session.user }
        await next()
    } else {
        ctx.body = { code: -1, message: "当前未登录" }
        return
    }
}


function searchByKey(key, List) {
    for (let i = 0; i < List.length; i++) {
        if (List[i].key === key) {
            return i;
        }
    }
    return -1;
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', function(err, data) {
            if (err) {
                reject(err);
                console.log(err);
                return;
            }
            resolve(data);
        })
    })
}

function getListbyPage(infolist, page) {
    let list = []
    for (let i = (page - 1) * 5; i <= (page * 5) - 1 && !!infolist[i]; i++) {
        list.push(infolist[i])
    }
    return list
}

async function getList(ctx, next) {
    //由于网页打开时一定会先调用getList，所以在此处完成初始化
    let page = ctx.request.body.page
    if (!!ctx.session.infoList) {
        ctx.body = { code: 1, list: getListbyPage(ctx.session.infoList, page), total: ctx.session.infoList.length }
    } else {
        let filename = `dataOf${ctx.session.user}.json`
        let filepath = path.join(__dirname, 'data', filename)

        //根据文件初始化SessionStorage
        await readFile(filepath).
        then(res => {
                ctx.session.infoList = JSON.parse(res);
                console.log(ctx.session.infoList);
            })
            .catch(err => {
                ctx.session.infoList = [];
                console.log('文件不存在，初始化infoList');
            })
        ctx.body = { code: 1, list: getListbyPage(ctx.session.infoList, page), total: ctx.session.infoList.length }
    }
    await next()
}

async function getInfo(ctx, next) {
    if (ctx.request.body !== undefined) {
        let key = ctx.request.body.key
        let index = searchByKey(key, ctx.session.infoList)
        ctx.body = { code: 1, Info: ctx.session.infoList[index] }
    } else {
        ctx.body = { code: 0, message: "数据传输出错" }
        return
    }
    await next()
}

async function createInfo(ctx, next) {
    //传入参数为info对象
    if (ctx.request.body !== undefined) {
        let data = ctx.request.body
        if (ctx.session.infoList === undefined) {
            ctx.session.infoList = []
        }
        ctx.session.infoList.push({
            key: data.key,
            avg: data.avg,
            name: data.name,
            major: data.major,
            grade: data.grade,
            sex: data.sex,
            phone: data.phone,
            email: data.email,
        })

        //文件操作与路径配置
        let filename = `dataOf${ctx.session.user}.json`
        let filepath = path.join(__dirname, 'data', filename)
        fs.writeFile(filepath, JSON.stringify(ctx.session.infoList), (err, data) => {
            if (!err) {
                console.log('成功写入');
            } else {
                console.log('写入失败');
            }
        })
        ctx.body = { code: 1, message: '创建成功' }
    } else {
        ctx.body = { code: 0, message: '创建失败' }
        return
    }
    await next()
}

async function updateInfo(ctx, next) {
    //传入参数为旧key与newInfo
    if (ctx.request.body !== undefined) {
        let key = ctx.request.body.key
        let data = ctx.request.body.newInfo
        let index = searchByKey(key, ctx.session.infoList)
        ctx.session.infoList[index] = {
            key: data.key,
            avg: data.avg,
            name: data.name,
            major: data.major,
            grade: data.grade,
            sex: data.sex,
            phone: data.phone,
            email: data.email,
        }
        let filename = `dataOf${ctx.session.user}.json`
        let filepath = path.join(__dirname, 'data', filename)
        fs.writeFile(filepath, JSON.stringify(ctx.session.infoList), (err, data) => {
            if (!err) {
                console.log('成功写入');
            } else {
                console.log('写入失败');
            }
        })
        ctx.body = { code: 1, message: '修改成功' }
    } else {
        ctx.body = { code: 0, message: '修改失败' }
        return
    }
    await next()
}

async function deleteInfo(ctx, next) {
    //传入值为删除项的key
    if (ctx.request.body !== undefined) {
        let key = ctx.request.body.key
        let index = searchByKey(key, ctx.session.infoList)
        ctx.session.infoList.splice(index, 1)
        let filename = `dataOf${ctx.session.user}.json`
        let filepath = path.join(__dirname, 'data', filename)
        fs.writeFile(filepath, JSON.stringify(ctx.session.infoList), (err, data) => {
            if (!err) {
                console.log('成功写入');
            } else {
                console.log('写入失败');
            }
        })
        ctx.body = { code: 1, message: '删除成功' }
    } else {
        ctx.body = { code: 0, message: '删除失败' }
    }

    await next()
}


async function searchInfo(ctx, next) {
    if (ctx.request.body !== undefined) {
        let name = ctx.request.body.name
        let list = ctx.session.infoList.filter((info) => { return info.name.indexOf(name) >= 0 })
        ctx.body = { code: 1, list: list, total: list.length }
    } else {
        ctx.body = { code: 0, message: '查询错误' }
    }
    await next()
}

async function searchBySex(ctx, next) {
    if (!!ctx.request.body) {
        let status = ctx.request.body.status
        let sex = status === 1 ? '男' : '女'
        let list = ctx.session.infoList.filter((info) => { return info.sex === sex })
        ctx.body = { code: 1, list: list, total: list.length }
    } else {
        ctx.body = { code: 0, message: '查询错误' }
    }
    await next()
}

router.post("/api/user/login", koaBody())
router.post("/api/user/login", toLogin)

router.post("/api/user/logout", koaBody())
router.post("/api/user/logout", toLogout)

router.get("/api/user/info", koaBody())
router.get("/api/user/info", isLogin)

router.post("/api/stu/list", koaBody())
router.post("/api/stu/list", isLogin, getList)

router.post("/api/stu/create", koaBody())
router.post("/api/stu/create", isLogin, createInfo)

router.post("/api/stu/update", koaBody())
router.post("/api/stu/update", isLogin, updateInfo)

router.post("/api/stu/delete", koaBody())
router.post("/api/stu/delete", isLogin, deleteInfo)

router.post("/api/stu/getone", koaBody())
router.post("/api/stu/getone", isLogin, getInfo)

router.post("/api/stu/search", koaBody())
router.post("/api/stu/search", isLogin, searchInfo)

router.post("/api/stu/sex", koaBody())
router.post("/api/stu/sex", isLogin, searchBySex)

app.use(router.routes()).use(router.allowedMethods())

app.listen(3001);