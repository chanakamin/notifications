export type SendEmailDto = {
    email: string,
    message: string;
}

export type SendSmsDto = {
    telephone: string,
    message: string;
}

export type SendMessageDto = SendEmailDto | SendSmsDto