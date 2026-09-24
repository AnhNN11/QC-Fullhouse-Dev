import Icon from "./ui-icon";

export default function ProtectionGraphic() {
  return (
    <div
      className="protection-graphic"
      role="img"
      aria-label="Bảo vệ gia đình, sức khỏe, xe và hành trình của bạn"
    >
      <div className="protection-orbit orbit-outer" />
      <div className="protection-orbit orbit-inner" />
      <div className="protection-center">
        <Icon name="shield" size={43} />
        <span>Trọn an tâm</span>
      </div>
      <span className="protection-node node-heart">
        <Icon name="heart" size={22} />
        <span>Sức khỏe</span>
      </span>
      <span className="protection-node node-car">
        <Icon name="car" size={22} />
        <span>Hành trình</span>
      </span>
      <span className="protection-node node-home">
        <Icon name="building" size={22} />
        <span>Tương lai</span>
      </span>
      <span className="orbit-dot dot-one" />
      <span className="orbit-dot dot-two" />
      <span className="orbit-star">✧</span>
    </div>
  );
}
