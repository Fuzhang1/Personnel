# server后端开发
## 运行说明
+ 服务端在安装依赖后，使用node index.js启动服务端。在static已成功生成后，在网页中访问127.0.0.1:/3001即可打开系统，系统两条账号如下:
+  账号: admin 密码: 123456
+  账号: root  密码: 123456 (本账号已内置5条数据)


## 开发思路
+ 后端开发使用nodejs+koa,语法规范采用eslint。

+ 本项目中我们使用koa-session来承载user与infolist信息，当koa-session为空时，我们根据用户名读取对应的文件来初始化之前列表记录。
  
+ 本项目中我们数据传输使用JSON的形式，使用koa-body作为中间件。

+ 采用fs文件读写，将koa-session同时维护在本地文件中。


## 接口设计

+ `post /api/user/login` 根据用户名密码，判断能否成功登录。成功则以 session 存储用户登录信息。
+ `post /api/user/logout` 退出登录，其实删除这个用户的 session 记录，即ctx.session.user
+ `get /api/user/info` 查询当前用户是否登录，即查看ctx.session.user是否为null或undefined,若登录则进行下一步操作,若未登录则返回，不执行之后的数据操作。
+ `post /api/stu/list` 根据前端传来的页码，返回列表的总数与当前页的人员信息。
+ `post /api/stu/create` 根据前端传来的Info对象，向列表中添加新的人员信息。
+ `post /api/stu/update` 根据前端传来的key值与Info对象,将列表中对应key的项修改为对应的人员信息。
+ `post /api/stu/delete` 根据前端传来的key值将列表中的对应项删除。
+ `post /api/stu/getone` 根据前端传来的key值，返回前端对应人员的具体信息。
+ `post /api/stu/search` 根据前端传来的关键字,返回符合搜索信息的人员信息列表。

## 过程中的问题
+ 对于koa的使用不熟悉，初时没有引入koa-body的中间件，导致难以获取前端发来的数据，后通过引入koa-body解决。
  
+ 使用koa-session导致列表不能过长，通过查询发现时因为当session中列表过长时cookie超过4096字节导致网站无法正常获取数据，后通过引入外部store将列表维护在文件中解决。