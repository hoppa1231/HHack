from pydantic import BaseModel

class Register(BaseModel):
    pass

class Login(BaseModel):
    pass

class NewsRequest(BaseModel):
    pass

class NewsResponse(BaseModel):
    pass

class SummaryRequest(BaseModel):
    pass

class SummaryResponse(BaseModel):
    pass