此命令行工具用于将任意node脚本设置为windows服务
=============

usage : 

```
sas service_name service_entrance_path [args]
```

通过调用windows系统的sc.exe来将命令写入注册表，使你写的node server能以service方式在后台工作。

依赖于本地的srvany.exe, 可以从微软获得 (Resource Kit Tools)[https://www.microsoft.com/en-us/download/details.aspx?id=17657]。

