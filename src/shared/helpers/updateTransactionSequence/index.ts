// @/shared/helpers/updateTransactionSequence/index.ts

import { Net } from '@/shared/types/store/slices/netSlice';
import { Server, AccountResponse } from 'stellar-sdk';

/**
 * Обновляет последовательный номер транзакции для указанного аккаунта Stellar.
 *
 * @param publicKey - Публичный ключ аккаунта Stellar.
 * @param serverUrl - URL Horizon сервера (по умолчанию основной Horizon сервер).
 * @returns Обновленный последовательный номер.
 * @throws Ошибка, если не удалось загрузить аккаунт или обновить последовательный номер.
 */
async function updateTransactionSequence(
  publicKey: string,
  net: Net
): Promise<number> {
  const serverUrl = net === 'public' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org';
  const server = new Server(serverUrl);

  try {
    const account: AccountResponse = await server.loadAccount(publicKey);
    const currentSequence: number = parseInt(account.sequence, 10);
    const updatedSequence: number = currentSequence + 1;
    return updatedSequence;
  } catch (error) {
    console.error('Ошибка при обновлении последовательного номера:', error);
    throw error;
  }
}

export default updateTransactionSequence;
