/**
 * LightLink 钱包类型定义
 * 定义与钱包(LightPay)相关的数据类型
 * @author 开发者：WaZixwx, HanBai
 */

// 钱包信息接口
export interface WalletInfo {
  id: string
  userId: string
  balance: number  // 单位：分，1元 = 100分
  status: WalletStatus
  createdAt: string
  updatedAt: string
  freeWithdrawalQuota: number  // 剩余免费提现额度，单位：分
}

// 钱包状态枚举
export enum WalletStatus {
  NORMAL = 'NORMAL',     // 正常
  FROZEN = 'FROZEN',     // 冻结
  DISABLED = 'DISABLED'  // 禁用
}

// 交易记录接口
export interface Transaction {
  id: string
  walletId: string
  type: TransactionType
  amount: number  // 单位：分，1元 = 100分
  status: TransactionStatus
  description: string
  targetUser?: UserInfo  // 目标用户（如转账收款方）
  createdAt: string
  updatedAt: string
}

// 交易类型枚举
export enum TransactionType {
  RECHARGE = 'RECHARGE',          // 充值
  WITHDRAW = 'WITHDRAW',          // 提现
  TRANSFER_IN = 'TRANSFER_IN',    // 转入
  TRANSFER_OUT = 'TRANSFER_OUT',  // 转出
  PAYMENT = 'PAYMENT',            // 支付
  REFUND = 'REFUND',              // 退款
  OTHERS = 'OTHERS'               // 其他
}

// 交易状态枚举
export enum TransactionStatus {
  PENDING = 'PENDING',     // 处理中
  COMPLETED = 'COMPLETED', // 已完成
  FAILED = 'FAILED',       // 失败
  CANCELED = 'CANCELED'    // 已取消
}

// 银行卡信息接口
export interface BankCard {
  id: string
  walletId: string
  cardNumber: string  // 卡号（部分隐藏）
  bankName: string    // 银行名称
  cardType: CardType  // 卡类型
  isDefault: boolean  // 是否为默认卡
  createdAt: string
  updatedAt: string
}

// 银行卡类型枚举
export enum CardType {
  DEBIT = 'DEBIT',   // 借记卡
  CREDIT = 'CREDIT'  // 信用卡
}

// 用户简要信息（用于转账）
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar: string
}

// 充值请求参数
export interface RechargeParams {
  amount: number       // 金额，单位：分
  paymentMethod: string // 支付方式
  bankCardId?: string  // 银行卡ID，选择银行卡支付时需要
}

// 提现请求参数
export interface WithdrawParams {
  amount: number      // 金额，单位：分
  bankCardId: string  // 银行卡ID
}

// 转账请求参数
export interface TransferParams {
  amount: number      // 金额，单位：分
  targetUserId: string // 接收方用户ID
  message?: string    // 转账留言
}

// 绑定银行卡请求参数
export interface BindBankCardParams {
  cardNumber: string  // 卡号
  holderName: string  // 持卡人姓名
  bankName: string    // 银行名称
  cardType: CardType  // 卡类型
  expiryDate?: string // 有效期（信用卡必填）
  cvv?: string        // 安全码（信用卡必填）
  phoneNumber: string // 预留手机号
} 