import './style.css';

export default function Modal ({ children }: any) {
  return (
    <div className="modal display-block">
      <section className="modal-main rounded-lg">
        {children}
      </section>
    </div>
  );
}