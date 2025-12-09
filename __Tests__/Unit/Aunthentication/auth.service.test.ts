import * as authRepository from '../../../src/repositories/auth.repository'
import * as authService from '../../../src/services/auth.service'

jest.mock("../../../src/repositories/auth.repository")

beforeEach(()=>{
  jest.clearAllMocks()
})


describe("Registration",()=>{
  it("Should register, hashpassword and sent verification email",async()=>{
    
    (authRepository.createUser as jest.Mock).mockResolvedValue()
    const response=await authRepository.createUser()

  })
})