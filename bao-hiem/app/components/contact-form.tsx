"use client";
import { useState } from "react";
import Icon from "./ui-icon";
import { products } from "../lib/products";
export default function ContactForm({
  initialProduct = "",
}: {
  initialProduct?: string;
}) {
  const [topic, setTopic] = useState(initialProduct);
  const [prepared, setPrepared] = useState(false);
  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const product =
          products.find((p) => p.slug === topic)?.name ??
          "Cần tư vấn lựa chọn phù hợp";
        const body = `Xin chào Bảo Tín An Tâm,\nTôi là: ${data.get("name")}\nSố điện thoại: ${data.get("phone")}\nNhu cầu: ${product}\nLời nhắn: ${data.get("message") || "Mong được tư vấn thêm."}`;
        window.location.href = `mailto:baotinantam@gmail.com?subject=${encodeURIComponent("Yêu cầu tư vấn - " + product)}&body=${encodeURIComponent(body)}`;
        setPrepared(true);
      }}
    >
      <div className="form-heading">
        <span className="feature-icon mint">
          <Icon name="file" size={23} />
        </span>
        <div>
          <h2>Chia sẻ nhu cầu của bạn</h2>
          <p>Chúng tôi bắt đầu từ việc lắng nghe.</p>
        </div>
      </div>
      <div className="form-row">
        <label>
          Họ và tên <span>*</span>
          <input
            autoComplete="name"
            name="name"
            required
            maxLength={100}
            placeholder="Tên của bạn"
          />
        </label>
        <label>
          Số điện thoại <span>*</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            pattern="[+]?[0-9 ]{9,16}"
            title="Nhập 9 đến 16 chữ số, có thể bắt đầu bằng dấu +"
            placeholder="Số điện thoại liên hệ"
          />
        </label>
      </div>
      <label>
        Bạn đang quan tâm đến
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Tôi cần tư vấn thêm</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Chia sẻ thêm <span className="optional">(không bắt buộc)</span>
        <textarea
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Điều bạn muốn bảo vệ, nhu cầu hoặc câu hỏi của bạn…"
        />
      </label>
      <div className="form-note">
        <Icon name="shield" size={17} />
        <p>
          Thông tin được điền vào ứng dụng email của bạn. Vui lòng kiểm tra và
          nhấn gửi để hoàn tất yêu cầu.
        </p>
      </div>
      <button className="button" type="submit">
        Soạn email yêu cầu tư vấn <Icon name="arrow" size={18} />
      </button>
      {prepared && (
        <p className="form-status" role="status">
          Đã yêu cầu mở ứng dụng email với nội dung của bạn. Nếu thiết bị chưa
          cài email, hãy gọi 0985 775 836 hoặc gửi thư tới
          baotinantam@gmail.com.
        </p>
      )}
    </form>
  );
}
