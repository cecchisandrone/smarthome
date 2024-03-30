curl 'http://192.168.1.16/web/cgi-bin/hi3510/param.cgi' \
  -H 'Authorization: Basic YWRtaW46cm9tYXRyZTgy' \
  --data-raw 'cmd=setntpattr&cururl=http%3A%2F%2F192.168.1.16%2Fweb%2Ftime.html&-ntpenable=1&-ntpserver=time.windows.com&-ntpinterval=1&cmd=setservertime&-timezone=Europe%2FBrussels&-dstmode=on' \
  --insecure
