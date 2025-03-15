/**
 * LightLink 钱包API接口
 * 封装钱包(LightPay)相关的API请求
 * @author 开发者：WaZixwx, HanBai
 */

import http from './http'
import { 
  WalletInfo, 
  Transaction, 
  BankCard, 
  UserInfo,
  RechargeParams,
  WithdrawParams,
  TransferParams,
  BindBankCardParams
} from '../types/wallet'

/**
 * 获取钱包信息
 * @returns 钱包信息
 */
export const getWalletInfo = async (): Promise<WalletInfo> => {
  return await http.get('/wallet/info')
}

/**
 * 激活钱包
 * @param securityPassword 安全密码
 * @returns 激活后的钱包信息
 */
export const activateWallet = async (securityPassword: string): Promise<WalletInfo> => {
  return await http.post('/wallet/activate', { securityPassword })
}

/**
 * 获取交易记录
 * @param page 页码，从1开始
 * @param pageSize 每页条数
 * @returns 交易记录列表
 */
export const getTransactions = async (page: number = 1, pageSize: number = 20): Promise<{
  transactions: Transaction[]
  total: number
  page: number
  pageSize: number
}> => {
  return await http.get('/wallet/transactions', {
    params: { page, pageSize }
  })
}

/**
 * 获取交易详情
 * @param transactionId 交易ID
 * @returns 交易详情
 */
export const getTransactionDetail = async (transactionId: string): Promise<Transaction> => {
  return await http.get(`/wallet/transactions/${transactionId}`)
}

/**
 * 获取银行卡列表
 * @returns 银行卡列表
 */
export const getBankCards = async (): Promise<BankCard[]> => {
  return await http.get('/wallet/bank-cards')
}

/**
 * 绑定银行卡
 * @param params 银行卡信息
 * @returns 绑定结果
 */
export const bindBankCard = async (params: BindBankCardParams): Promise<BankCard> => {
  return await http.post('/wallet/bank-cards', params)
}

/**
 * 设置默认银行卡
 * @param cardId 银行卡ID
 * @returns 设置结果
 */
export const setDefaultBankCard = async (cardId: string): Promise<void> => {
  await http.put(`/wallet/bank-cards/${cardId}/default`)
}

/**
 * 解绑银行卡
 * @param cardId 银行卡ID
 * @returns 解绑结果
 */
export const unbindBankCard = async (cardId: string): Promise<void> => {
  await http.delete(`/wallet/bank-cards/${cardId}`)
}

/**
 * 充值
 * @param params 充值参数
 * @returns 充值订单信息
 */
export const recharge = async (params: RechargeParams): Promise<{
  orderId: string
  redirectUrl?: string
}> => {
  return await http.post('/wallet/recharge', params)
}

/**
 * 提现
 * @param params 提现参数
 * @returns 提现结果
 */
export const withdraw = async (params: WithdrawParams): Promise<{
  orderId: string
  feeAmount: number
}> => {
  return await http.post('/wallet/withdraw', params)
}

/**
 * 转账
 * @param params 转账参数
 * @returns 转账结果
 */
export const transfer = async (params: TransferParams): Promise<{
  transactionId: string
}> => {
  return await http.post('/wallet/transfer', params)
}

/**
 * 搜索好友(用于转账)
 * @param keyword 搜索关键词
 * @returns 用户列表
 */
export const searchUsers = async (keyword: string): Promise<UserInfo[]> => {
  return await http.get('/wallet/search-users', {
    params: { keyword }
  })
}

/**
 * 修改钱包安全密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns 修改结果
 */
export const changeSecurityPassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await http.put('/wallet/security-password', { oldPassword, newPassword })
}

/**
 * 重置钱包安全密码
 * @param verificationCode 验证码
 * @param newPassword 新密码
 * @returns 重置结果
 */
export const resetSecurityPassword = async (verificationCode: string, newPassword: string): Promise<void> => {
  await http.post('/wallet/reset-security-password', { verificationCode, newPassword })
}

/**
 * 发送安全密码重置验证码
 * @returns 发送结果
 */
export const sendSecurityPasswordResetCode = async (): Promise<void> => {
  await http.post('/wallet/send-reset-code')
} 