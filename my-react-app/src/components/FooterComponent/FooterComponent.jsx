import React from 'react';

const styles = {
    footer: {
        marginTop: 16,
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 'normal',
        color: 'rgb(128, 128, 137)',
        backgroundColor: 'white',
        display: 'block',
        unicodeBidi: 'isolate',
    },
    sectionOuter: {
        padding: '16px 0',
        display: 'block',
        unicodeBidi: 'isolate',
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 'normal',
        color: 'rgb(128, 128, 137)',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 20,
        padding: '0 16px',
        unicodeBidi: 'isolate',
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 'normal',
        color: 'rgb(128, 128, 137)',
    },
    colWide: {
        width: 268,
        display: 'block',
        unicodeBidi: 'isolate',
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 'normal',
        color: 'rgb(128, 128, 137)',
    },
    col: {
        width: 226,
        display: 'block',
        unicodeBidi: 'isolate',
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 'normal',
        color: 'rgb(128, 128, 137)',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgb(235, 235, 240)',
        width: '100%',
        maxWidth: 1240,
        margin: '0 auto',
        display: 'block',
        unicodeBidi: 'isolate',
    },
    companyWrap: {
        padding: '16px 0px',
        backgroundColor: 'rgb(255, 255, 255)',
        display: 'block',
        unicodeBidi: 'isolate',
    },
    companyRow: {
        display: 'flex',
        padding: '0 16px',
        unicodeBidi: 'isolate',
    },
    companyInner: {
        display: 'flex',
        alignItems: 'center',
        unicodeBidi: 'isolate',
    },
    italicI: {
        display: 'inline-block',
        verticalAlign: 'middle',
        fontStyle: 'italic',
    },
    companyTextWrap: {
        display: 'block',
        unicodeBidi: 'isolate',
        marginTop: '16px',
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: 'normal',
        color: 'rgb(128, 128, 137)',
        backgroundColor: 'white',
    },
    companyTitle: {
        fontSize: 16,
        lineHeight: '24px',
        fontWeight: 500,
        color: 'rgb(56, 56, 61)',
        marginTop: 0,
        marginBottom: 12,
        unicodeBidi: 'isolate',
    },
    companyLine: {
        fontSize: 12,
        lineHeight: '16px',
        color: 'rgb(128, 128, 137)',
        marginTop: 0,
        marginBottom: 12,
        unicodeBidi: 'isolate',
    },
    companyLineTight: {
        fontSize: 12,
        lineHeight: '16px',
        color: 'rgb(128, 128, 137)',
        margin: '0 0 12px',
        unicodeBidi: 'isolate',
    },
};

export default function FooterComponent() {
    return (
        <footer style={styles.footer}>
            {/* ====== Khối cột link ====== */}
            <div style={styles.sectionOuter}>
                <div style={styles.row}>
                    {/* Col 1: Hỗ trợ khách hàng */}
                    <div style={styles.colWide}>
                        <h4 className="sc-4ce82f3c-4 aMfcf">Hỗ trợ khách hàng</h4>
                        <p className="hotline">
                            Hotline: <a href="tel:1900-0000">1900-0000</a>{' '}
                            <span className="small-text">(1000 đ/phút, 8-21h kể cả T7, CN)</span>
                        </p>
                        <a
                            rel="noreferrer"
                            href="https://hotro.tiki.vn/knowledge-base"
                            className="small-text"
                            target="_blank"
                        >
                            Các câu hỏi thường gặp
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://hotro.tiki.vn/request/new-request"
                            className="small-text"
                            target="_blank"
                        >
                            Gửi yêu cầu hỗ trợ
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://hotro.tiki.vn/knowledge-base/post/898-lam-the-nao-de-toi-dat-hang-qua-website-tiki"
                            className="small-text"
                            target="_blank"
                        >
                            Hướng dẫn đặt hàng
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://hotro.tiki.vn/knowledge-base/post/838-cac-hinh-thuc-giao-hang-tai-tiki"
                            className="small-text"
                            target="_blank"
                        >
                            Phương thức vận chuyển
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/chinh-sach-kiem-hang"
                            className="small-text"
                            target="_blank"
                        >
                            Chính sách kiểm hàng
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://hotro.tiki.vn/knowledge-base/post/802-chinh-sach-doi-tra-san-pham"
                            className="small-text"
                            target="_blank"
                        >
                            Chính sách đổi trả
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/khuyen-mai/huong-dan-tra-gop"
                            className="small-text"
                            target="_blank"
                        >
                            Hướng dẫn trả góp
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://hotro.tiki.vn/knowledge-base/post/883-dich-vu-giao-hang-tu-nuoc-ngoai"
                            className="small-text"
                            target="_blank"
                        >
                            Chính sách hàng nhập khẩu
                        </a>
                        <p className="security">
                            Hỗ trợ khách hàng:{' '}
                            <a href="mailto:hotro@aha.vn">hotro@aha.vn</a>
                        </p>
                        <p className="security" style={{ marginBottom: 0 }}>
                            Báo lỗi bảo mật:{' '}
                            <a href="mailto:security@aha.vn">security@aha.vn</a>
                        </p>
                    </div>

                    {/* Col 2: Về Aha */}
                    <div style={styles.col}>
                        <h4 className="sc-4ce82f3c-4 aMfcf">Về Aha</h4>
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/thong-tin/gioi-thieu-ve-tiki"
                            className="small-text"
                            target="_blank"
                        >
                            Giới thiệu Aha
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/blog/"
                            className="small-text"
                            target="_blank"
                        >
                            Aha Blog
                        </a>
                        <br />
                        <a
                            rel="nofollow noreferrer"
                            href="https://tuyendung.tiki.vn/"
                            className="small-text"
                            target="_blank"
                        >
                            Tuyển dụng
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/bao-mat-thanh-toan"
                            className="small-text"
                            target="_blank"
                        >
                            Chính sách bảo mật thanh toán
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/bao-mat-thong-tin-ca-nhan"
                            className="small-text"
                            target="_blank"
                        >
                            Chính sách bảo mật thông tin cá nhân
                        </a>
                        <br />
                        <a
                            rel="nofollow noreferrer"
                            href="https://hotro.tiki.vn/knowledge-base/post/778-chinh-sach-giai-quyet-khieu-nai"
                            className="small-text"
                            target="_blank"
                        >
                            Chính sách giải quyết khiếu nại
                        </a>
                        <br />
                        <a
                            rel="nofollow noreferrer"
                            href="https://hotro.tiki.vn/knowledge-base/post/850-dieu-khoan-su-dung"
                            className="small-text"
                            target="_blank"
                        >
                            Điều khoản sử dụng
                        </a>
                        <br />
                        <a
                            rel="nofollow noreferrer"
                            href="https://hotro.tiki.vn/knowledge-base/post/979-tiki-xu-la-gi?-gia-tri-quy-doi-nhu-the-nao?"
                            className="small-text"
                            target="_blank"
                        >
                            Giới thiệu Aha Xu
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/khuyen-mai/tiki-tiep-thi-lien-ket"
                            className="small-text"
                            target="_blank"
                        >
                            Tiếp thị liên kết cùng Aha
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/khuyen-mai/ban-hang-doanh-nghiep"
                            className="small-text"
                            target="_blank"
                        >
                            Bán hàng doanh nghiệp
                        </a>
                        <br />
                        <a
                            rel="nofollow noreferrer"
                            href="https://www.tikinow.biz/%C4%91i%E1%BB%81u-kho%E1%BA%A3n-v%E1%BA%ADn-chuy%E1%BB%83n"
                            className="small-text"
                            target="_blank"
                        >
                            Điều kiện vận chuyển
                        </a>
                    </div>

                    {/* Col 3: Hợp tác & liên kết */}
                    <div style={styles.col}>
                        <h4 className="sc-4ce82f3c-4 aMfcf">Hợp tác và liên kết</h4>
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/quy-che-hoat-dong-sgdtmdt"
                            className="small-text"
                            target="_blank"
                        >
                            Quy chế hoạt động Sàn GDTMĐT
                        </a>
                        <br />
                        <a
                            rel="noreferrer"
                            href="https://tiki.vn/khuyen-mai/ban-hang-cung-tiki"
                            className="small-text"
                            target="_blank"
                        >
                            Bán hàng cùng Aha
                        </a>
                        <h4 className="sc-4ce82f3c-4 aMfcf" style={{ marginTop: 24 }}>
                            Chứng nhận bởi
                        </h4>
                        <div className="flex">
                            <a
                                href="https://hotro.tiki.vn/knowledge-base"
                                rel="nofollow noreferrer"
                                aria-label=""
                                target="_blank"
                                style={{ height: 32 }}
                            >
                                <img
                                    src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png"
                                    width={32}
                                    height={32}
                                    alt="bo-cong-thuong-2"
                                />
                            </a>
                            <a
                                href="http://online.gov.vn/Home/WebDetails/21193"
                                rel="nofollow noreferrer"
                                aria-label=""
                                target="_blank"
                                style={{ height: 32 }}
                            >
                                <img
                                    src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg"
                                    height={32}
                                    width={83}
                                    alt="bo-cong-thuong"
                                />
                            </a>
                            <a
                                href="https://www.dmca.com/Protection/Status.aspx?ID=388d758c-6722-4245-a2b0-1d2415e70127&refurl=https://tiki.vn/"
                                title="DMCA.com Protection Status"
                                className="dmca-badge"
                                rel="nofollow noreferrer"
                                target="_blank"
                                style={{ height: 32 }}
                            >
                                <img
                                    src="https://images.dmca.com/Badges/dmca_protected_sml_120y.png?ID=388d758c-6722-4245-a2b0-1d2415e70127"
                                    alt="DMCA.com Protection Status"
                                    width={32}
                                    height={32}
                                />
                            </a>
                        </div>
                    </div>

                    {/* Col 4: Phương thức thanh toán */}
                    <div style={styles.col}>
                        <h4 className="sc-4ce82f3c-4 aMfcf">Phương thức thanh toán</h4>
                        <p className="payment">
                            <span className="icon">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                ></svg>
                            </span>
                        </p>
                    </div>

                    {/* Col 5: Kết nối với chúng tôi */}
                    <div style={styles.col}>
                        <h4 className="sc-4ce82f3c-4 aMfcf">Kết nối với chúng tôi</h4>
                        <p>
                            <a
                                rel="nofollow noreferrer"
                                href="https://www.facebook.com/tiki.vn/"
                                className="icon"
                                target="_blank"
                                title="Facebook"
                            >
                                <svg
                                    width="32"
                                    height="33"
                                    viewBox="0 0 32 33"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                ></svg>
                            </a>
                            <a
                                rel="nofollow noreferrer"
                                href="https://www.youtube.com/user/TikiVBlog"
                                className="icon"
                                target="_blank"
                                title="Youtube"
                            >
                                <svg
                                    width="32"
                                    height="33"
                                    viewBox="0 0 32 33"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                ></svg>
                            </a>
                            <a
                                rel="nofollow noreferrer"
                                href="http://zalo.me/589673439383195103"
                                className="icon"
                                target="_blank"
                                title="Zalo"
                            >
                                <svg
                                    width="32"
                                    height="33"
                                    viewBox="0 0 32 33"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                ></svg>
                            </a>
                        </p>
                    </div>
                </div>

                <div style={styles.divider} />
            </div>

            {/* ====== Khối thông tin công ty ====== */}
            <div>
                <div style={styles.companyWrap}>
                    <div style={styles.companyRow}>
                        <div style={styles.companyInner}>
                            <i style={styles.italicI}></i>
                            <div style={styles.companyTextWrap}>
                                <p style={styles.companyTitle}>Công ty AHA</p>
                                <p style={styles.companyLine}>Phú Diễn Bắc Từ Liêm Hà Nội</p>
                                <p style={styles.companyLineTight}>Hotline: 1900 0000</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.divider} />
            </div>
        </footer>
    );
}
