import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';

type polyvResponse = { code: number; data: any; message: string; status: string };
type EntityResponseType = HttpResponse<polyvResponse>;

@Injectable({ providedIn: 'root' })
export class PolyvService {
    private getQueryParams(vids: string): HttpParams {
        const ptime = new Date().getTime();
        const sign = this.SHA1(`ptime=${ptime}&vids=${vids}THPRqoLhIa`);
        return new HttpParams()
            .set('ptime', ptime.toString())
            .set('vids', vids)
            .set('sign', sign);
    }

    private add(x, y) {
        // tslint:disable-next-line no-bitwise
        return ((x & 0x7fffffff) + (y & 0x7fffffff)) ^ (x & 0x80000000) ^ (y & 0x80000000);
    }

    private SHA1hex(num) {
        const sHEXChars = '0123456789abcdef';
        let str = '';
        for (let j = 7; j >= 0; j--) {
            // tslint:disable-next-line no-bitwise
            str += sHEXChars.charAt((num >> (j * 4)) & 0x0f);
        }
        return str;
    }

    private AlignSHA1(sIn) {
        // tslint:disable-next-line no-bitwise
        const nblk = ((sIn.length + 8) >> 6) + 1,
            blks = new Array(nblk * 16);
        for (let i = 0; i < nblk * 16; i++) {
            blks[i] = 0;
        }
        for (let i = 0; i < sIn.length; i++) {
            // tslint:disable-next-line no-bitwise
            blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
        }
        // tslint:disable-next-line no-bitwise
        blks[sIn.length >> 2] |= 0x80 << (24 - (sIn.length & 3) * 8);
        blks[nblk * 16 - 1] = sIn.length * 8;
        return blks;
    }

    private rol(num, cnt) {
        // tslint:disable-next-line no-bitwise
        return (num << cnt) | (num >>> (32 - cnt));
    }

    private ft(t, b, c, d) {
        if (t < 20) {
            // tslint:disable-next-line no-bitwise
            return (b & c) | (~b & d);
        } else if (t < 40) {
            // tslint:disable-next-line no-bitwise
            return b ^ c ^ d;
        } else if (t < 60) {
            // tslint:disable-next-line no-bitwise
            return (b & c) | (b & d) | (c & d);
        } else {
            // tslint:disable-next-line no-bitwise
            return b ^ c ^ d;
        }
    }

    private kt(t) {
        return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
    }

    SHA1(sIn) {
        const x = this.AlignSHA1(sIn);
        const w = new Array(80);
        let a = 1732584193;
        let b = -271733879;
        let c = -1732584194;
        let d = 271733878;
        let e = -1009589776;
        for (let i = 0; i < x.length; i += 16) {
            const olda = a;
            const oldb = b;
            const oldc = c;
            const oldd = d;
            const olde = e;
            for (let j = 0; j < 80; j++) {
                if (j < 16) {
                    w[j] = x[i + j];
                } else {
                    // tslint:disable-next-line no-bitwise
                    w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                }
                const t = this.add(this.add(this.rol(a, 5), this.ft(j, b, c, d)), this.add(this.add(e, w[j]), this.kt(j)));
                e = d;
                d = c;
                c = this.rol(b, 30);
                b = a;
                a = t;
            }
            a = this.add(a, olda);
            b = this.add(b, oldb);
            c = this.add(c, oldc);
            d = this.add(d, oldd);
            e = this.add(e, olde);
        }
        const SHA1Value = this.SHA1hex(a) + this.SHA1hex(b) + this.SHA1hex(c) + this.SHA1hex(d) + this.SHA1hex(e);
        return SHA1Value.toUpperCase();
    }
}
