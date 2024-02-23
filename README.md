## 使用说明

1. 在官网 <https://arcaea.lowiro.com/zh> 登录自己的账号
2. 访问 <https://webapi.lowiro.com/webapi/user/me>
3. 按 F12 之类的键来打开控制台
4. 复制 `abc.js` 的内容并在控制台内运行
5. 查看输出

## 备注

* 脚本部分考虑了搭档技能带来的结果变化。
  维塔仅考虑了取到最大 over 时的情况。
  Ilith & Ivy 和 Hikari & Vanessa 的技能发动具有随机性，仅作了简单处理。

* 脚本没有考虑有的搭档（例如光（Fatalis））无法进行 Beyond 挑战导致的基础值降低。
  基础值和成绩相关，因此降低倍率无法提前计算。一个可供参考的近似倍率是 2/3。
  * 光（Fatalis）的另一个需要自行考虑的点是双倍体力，除非你打算打一把睡觉。

* 脚本获取信息的方式是直接读取浏览器上显示的内容。
  如果浏览器上有 JSON 美化插件之类，脚本可能无法正确获取信息，请暂时关闭。

* 输出可以通过修改部分变量来部分自定义：
  * 修改 `displayLines` 可以修改输出排行前多少位的搭档
  * 把对应法则的 `show` 改成 `false` 可以不输出这个法则的结果

* 脚本不会向任何地方发送任何关于您的账号的信息，请放心使用。