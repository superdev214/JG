export function getMessage(msg: string[] | string): string {
  if (Array.isArray(msg)) {
    return msg.join('. ');
  } else {
    return msg;
  }
}
