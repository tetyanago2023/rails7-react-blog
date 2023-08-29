# README

Ruby version - 3.2.2.

At the moment of this repository creation there exists the problem to install ruby versions 3+.

Please try following strategy:

~% brew list | grep openssl #check if openssl@1.1 is installed, if not

~% brew install openssl@1.1

get the path of openssl@1.1 by the following command:

~% brew --prefix openssl@1.1 #you should get something similar to /usr/local/opt/openssl@1.1

then install the required version of Ruby:

~% rvm install 3.2.2 --with-openssl-dir=/usr/local/opt/openssl@1.1

Resource - https://github.com/rvm/rvm/issues/5047

Rails version - 7.0.7

