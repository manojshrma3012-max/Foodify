import crypto from 'crypto';
export const verifysign = (orderid, paymentid, sign) => {
    const body = `${orderid}|${paymentid}`;
    const expectedsign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    console.log(sign);
    console.log(expectedsign);
    return expectedsign === sign;
};
