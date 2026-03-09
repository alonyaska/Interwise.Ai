from fastapi import HTTPException,status

class InterwiseExceptions(HTTPException):
    status_code = 500
    detail = ""


    def __init__(self):
        super().__init__(status_code= self.status_code,detail=self.detail)



class InterwiseAnalyze(InterwiseExceptions):
    status_code = 503
    detail = "error when sending request to API"

class InterwiseFinally(InterwiseExceptions):
    status_code = 200
    detail = ""


class InterwiseConectionSock(InterwiseExceptions):
    status_code =  599
    detail = "Network Timeout"


class InterwiseWebSocket(InterwiseExceptions):
    status_code = 409
    detail = "WebSocket is  out  XD funny "