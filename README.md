![blazing-squirrel](public/images/bs.png)
# blazing-squirrel #
io.js + HTML5 SQL client

## Linux Install:
+ Download CLI driver
+ on Linux, install unixodbc and git:
```sh
apt-get install iojs npm git unixodbc unixodbc-dev -y
```
+ create a [BLAZING_SQUIRREL] driver in `odbcinst.ini` ([example](examples/linux/odbcinst.ini))
+ `git clone https://github.com/LeoDutra/blazing-squirrel.git`
+ `cd blazing-squirrel`
+ `npm install`
+ `npm start`
+ go to [http://localhost:3000]()
