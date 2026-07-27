// ============================================================
// WiT Platform - Firebase Auth error messages (tiếng Việt)
// ============================================================

import { FirebaseError } from 'firebase/app';

/** Rút mã lỗi dạng `auth/...` từ bất kỳ error nào Firebase ném ra. */
export function authErrorCode(err: unknown): string {
  if (err instanceof FirebaseError) return err.code;
  const message = err instanceof Error ? err.message : String(err);
  const match = message.match(/auth\/[a-z-]+/);
  return match ? match[0] : '';
}

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email hoặc mật khẩu không đúng.',
  'auth/user-not-found': 'Email hoặc mật khẩu không đúng.',
  'auth/wrong-password': 'Email hoặc mật khẩu không đúng.',
  'auth/missing-password': 'Vui lòng nhập mật khẩu.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/user-disabled': 'Tài khoản này đã bị vô hiệu hoá.',
  'auth/too-many-requests': 'Quá nhiều lần thử. Vui lòng đợi một lúc rồi thử lại.',
  'auth/email-already-in-use': 'Email này đã được sử dụng.',
  'auth/weak-password': 'Mật khẩu quá yếu. Hãy dùng ít nhất 6 ký tự.',
  'auth/network-request-failed': 'Không kết nối được máy chủ. Kiểm tra kết nối mạng và thử lại.',

  // Google / popup
  'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập Google.',
  'auth/cancelled-popup-request': 'Bạn đã đóng cửa sổ đăng nhập Google.',
  'auth/user-cancelled': 'Bạn đã huỷ đăng nhập bằng Google.',
  'auth/account-exists-with-different-credential':
    'Email này đã đăng ký bằng mật khẩu. Hãy đăng nhập bằng email/mật khẩu, hoặc dùng "Quên mật khẩu?" để đặt lại.',

  // Cấu hình phía Firebase Console
  'auth/operation-not-allowed':
    'Phương thức đăng nhập này chưa được bật trong Firebase Console (Authentication → Sign-in method).',
  'auth/unauthorized-domain':
    'Tên miền hiện tại chưa được cho phép trong Firebase Console (Authentication → Settings → Authorized domains).',
};

/** Thông báo tiếng Việt cho lỗi Firebase Auth, có fallback khi không nhận diện được. */
export function authErrorMessage(err: unknown, fallback: string): string {
  const code = authErrorCode(err);
  if (MESSAGES[code]) return MESSAGES[code];
  return err instanceof Error && err.message ? err.message : fallback;
}
