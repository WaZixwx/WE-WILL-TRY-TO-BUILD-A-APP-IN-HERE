/**
 * LightLink 钱包状态管理模块
 * 管理钱包(LightPay)相关状态
 * @author 开发者：WaZixwx, HanBai
 */

import { defineStore } from 'pinia'
import { 
  WalletInfo, 
  Transaction, 
  BankCard,
  WalletStatus,
  TransactionType,
  TransactionStatus 
} from '../../types/wallet'
import {
  getWalletInfo,
  activateWallet,
  getTransactions,
  getBankCards,
  bindBankCard,
  recharge,
  withdraw,
  transfer
} from '../../api/wallet'

// 定义钱包状态类型
interface WalletState {
  walletInfo: WalletInfo | null;
  transactions: Transaction[];
  transactionsTotal: number;
  currentPage: number;
  pageSize: number;
  bankCards: BankCard[];
  isLoading: boolean;
  error: string | null;
}

export const useWalletStore = defineStore('wallet', {
  // 状态
  state: (): WalletState => ({
    walletInfo: null,
    transactions: [],
    transactionsTotal: 0,
    currentPage: 1,
    pageSize: 20,
    bankCards: [],
    isLoading: false,
    error: null
  }),

  // 计算属性
  getters: {
    // 格式化的钱包余额（元）
    formattedBalance: (state: WalletState) => {
      if (!state.walletInfo) return '0.00';
      return (state.walletInfo.balance / 100).toFixed(2);
    },
    
    // 格式化的免费提现额度（元）
    formattedFreeWithdrawalQuota: (state: WalletState) => {
      if (!state.walletInfo) return '0.00';
      return (state.walletInfo.freeWithdrawalQuota / 100).toFixed(2);
    },
    
    // 钱包是否已激活
    isWalletActivated: (state: WalletState) => {
      return state.walletInfo?.status === WalletStatus.NORMAL;
    },
    
    // 钱包是否被冻结
    isWalletFrozen: (state: WalletState) => {
      return state.walletInfo?.status === WalletStatus.FROZEN;
    },
    
    // 获取默认银行卡
    defaultBankCard: (state: WalletState) => {
      return state.bankCards.find((card: BankCard) => card.isDefault) || null;
    },
    
    // 是否有绑定的银行卡
    hasBankCards: (state: WalletState) => {
      return state.bankCards.length > 0;
    }
  },

  // 操作方法
  actions: {
    // 设置钱包信息
    setWalletInfo(walletInfo: WalletInfo | null) {
      this.walletInfo = walletInfo;
    },
    
    // 设置交易记录
    setTransactions(transactions: Transaction[], total: number, page: number, pageSize: number) {
      this.transactions = transactions;
      this.transactionsTotal = total;
      this.currentPage = page;
      this.pageSize = pageSize;
    },
    
    // 设置银行卡列表
    setBankCards(bankCards: BankCard[]) {
      this.bankCards = bankCards;
    },
    
    // 设置加载状态
    setLoading(status: boolean) {
      this.isLoading = status;
    },
    
    // 设置错误信息
    setError(error: string | null) {
      this.error = error;
    },
    
    // 获取钱包信息
    async fetchWalletInfo() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const walletInfo = await getWalletInfo();
        this.setWalletInfo(walletInfo);
        return true;
      } catch (error) {
        this.setError(error as string);
        return false;
      } finally {
        this.setLoading(false);
      }
    },
    
    // 激活钱包
    async activateWalletAction(securityPassword: string) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const walletInfo = await activateWallet(securityPassword);
        this.setWalletInfo(walletInfo);
        return true;
      } catch (error) {
        this.setError(error as string);
        return false;
      } finally {
        this.setLoading(false);
      }
    },
    
    // 获取交易记录
    async fetchTransactions(page: number = 1, pageSize: number = 20) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const { transactions, total, page: currentPage, pageSize: size } = await getTransactions(page, pageSize);
        this.setTransactions(transactions, total, currentPage, size);
        return true;
      } catch (error) {
        this.setError(error as string);
        return false;
      } finally {
        this.setLoading(false);
      }
    },
    
    // 获取银行卡列表
    async fetchBankCards() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const bankCards = await getBankCards();
        this.setBankCards(bankCards);
        return true;
      } catch (error) {
        this.setError(error as string);
        return false;
      } finally {
        this.setLoading(false);
      }
    },
    
    // 充值操作
    async rechargeAction(amount: number, paymentMethod: string, bankCardId?: string) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const result = await recharge({
          amount,
          paymentMethod,
          bankCardId
        });
        
        // 充值成功后刷新钱包信息
        await this.fetchWalletInfo();
        
        return result;
      } catch (error) {
        this.setError(error as string);
        return false;
      } finally {
        this.setLoading(false);
      }
    },
    
    // 提现操作
    async withdrawAction(amount: number, bankCardId: string) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const result = await withdraw({
          amount,
          bankCardId
        });
        
        // 提现申请成功后刷新钱包信息
        await this.fetchWalletInfo();
        
        return result;
      } catch (error) {
        this.setError(error as string);
        return false;
      } finally {
        this.setLoading(false);
      }
    },
    
    // 转账操作
    async transferAction(amount: number, targetUserId: string, message?: string) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const result = await transfer({
          amount,
          targetUserId,
          message
        });
        
        // 转账成功后刷新钱包信息
        await this.fetchWalletInfo();
        
        return result;
      } catch (error) {
        this.setError(error as string);
        return false;
      } finally {
        this.setLoading(false);
      }
    },
    
    // 格式化金额（分转元，并保留两位小数）
    formatAmount(amount: number): string {
      return (amount / 100).toFixed(2);
    },
    
    // 解析金额（元转分，处理用户输入）
    parseAmount(amount: string): number {
      const parsed = parseFloat(amount);
      if (isNaN(parsed)) return 0;
      return Math.round(parsed * 100);
    },
    
    // 获取交易类型中文名称
    getTransactionTypeName(type: TransactionType): string {
      const typeNames: Record<TransactionType, string> = {
        [TransactionType.RECHARGE]: '充值',
        [TransactionType.WITHDRAW]: '提现',
        [TransactionType.TRANSFER_IN]: '转入',
        [TransactionType.TRANSFER_OUT]: '转出',
        [TransactionType.PAYMENT]: '支付',
        [TransactionType.REFUND]: '退款',
        [TransactionType.OTHERS]: '其他'
      };
      return typeNames[type] || '未知';
    },
    
    // 获取交易状态中文名称
    getTransactionStatusName(status: TransactionStatus): string {
      const statusNames: Record<TransactionStatus, string> = {
        [TransactionStatus.PENDING]: '处理中',
        [TransactionStatus.COMPLETED]: '已完成',
        [TransactionStatus.FAILED]: '失败',
        [TransactionStatus.CANCELED]: '已取消'
      };
      return statusNames[status] || '未知';
    },
    
    // 计算提现手续费
    calculateWithdrawalFee(amount: number): number {
      if (!this.walletInfo) return 0;
      
      // 如果有免费额度，且金额在免费额度内，则无手续费
      if (this.walletInfo.freeWithdrawalQuota >= amount) {
        return 0;
      }
      
      // 超出免费额度的部分，收取0.1%手续费，最高500元
      const fee = Math.round(amount * 0.001);
      return Math.min(fee, 50000); // 50000分 = 500元
    }
  }
}) 