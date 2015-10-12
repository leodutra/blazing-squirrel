![blazing-squirrel](public/images/bs.png)
# Blazing Squirrel #
Node.js (and io.js) + HTML5 SQL client

## Linux Install:
+ [install Node.js](https://nodejs.org/en/download/package-manager);
+ download CLI driver (IBM Data Driver Package, PostGreSQL driver, MySQl driver, etc);
+ install unixodbc, git and g++ make:
```sh
apt-get install -y git unixodbc unixodbc-dev make build-essential g++
```
+ create a [BLAZING_SQUIRREL] driver in `odbcinst.ini` ([example](examples/linux/odbcinst.ini))
+ then:
```sh
git clone https://github.com/LeoDutra/blazing-squirrel.git
cd blazing-squirrel
npm install
npm start
```
+ go to [http://localhost:3000]()

## How to make a "phoenosquirrel" (phoenix + squirrel) (⌐■_■)
Optionally, use BlazingSquirrel with [PM2](http://pm2.keymetrics.io/), so it will restart automatically after failures and system reboot.
Just configure your PM2 and run our `pm2.sh`. 

## Using the FreeTDS ODBC driver
[Go to node-odbc's FreeTDS driver reference](https://github.com/wankdanker/node-odbc#using-the-freetds-odbc-driver)