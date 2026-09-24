# Cookie and device-storage implementation

Reviewed 24 September 2026. Scope: this Next.js application, not the production hosting provider or the company's insurance/customer processing operations.

## Actual inventory

No analytics, marketing pixels, third-party embeds or optional cookie libraries are installed. Fonts are built locally by next/font; image requests are same-origin. The preference widget does not grant analytics/marketing consent and must not be used as a signal authorizing future trackers.

Only after an explicit save action, `btat:privacy:v1` is written to localStorage, containing version, necessary-only mode, savedAt and expiresAt. It remains client-local; there is no server-side consent ledger because no optional personal-data processing is authorized by this widget. Retention is a product choice of 180 days, not a claim that law mandates that duration. Expired or malformed records are cleared on subsequent load. No storage is written for declining or dismissing; browsing remains available even when browser storage is disabled.

Footer settings support deletion, preference editing, keyboard dismissal and focus restoration. Cross-tab storage changes are reflected. The policy page distinguishes localStorage from HTTP cookies and explains the email-draft form and third-party links.

## Legal sources consulted

- Law 91/2025/QH15, official record: https://chinhphu.vn/?docid=214590&pageid=27160&typegroupid=3
- Ministry of Public Security summary of rights and effective date: https://mps.gov.vn/bai-viet/luat-bao-ve-du-lieu-ca-nhan-chinh-thuc-co-hieu-luc-thi-hanh-tu-ngay-01-01-2026-1767186124
- Decree 356/2025 implementing the law: https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/01/356-nd.signed.pdf
- EU cookie-banner UX guidance (reference, not a statement that EU law automatically applies to this Vietnamese business): https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf

## Deployment boundary

A banner alone does not certify business-wide legal compliance. Before production, verify hosting/access-log collection and retention against the operator's actual configuration. Adding analytics, ads, embedded services or backend lead collection requires an updated data inventory, specific notices, purpose-specific prior consent where applicable, appropriate consent evidence and withdrawal handling. Do not treat this necessary-only preference as consent for those purposes or for insurance processing or marketing. No optional trackers may be added outside a properly reviewed consent gate.
