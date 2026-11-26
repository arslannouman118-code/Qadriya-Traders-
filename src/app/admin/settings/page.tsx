import { requireAdmin } from "@/lib/admin-auth";
import { getDeliverySettings } from "@/lib/settings";
import { calcDelivery } from "@/lib/delivery";
import { formatPrice } from "@/lib/catalog";
import { saveDeliverySettings } from "../actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { saved, error } = await searchParams;
  const d = await getDeliverySettings();
  const examples = [500, 1000, 2000, 5000];
  return (
    <>
      <h1>Delivery charges</h1>
      <p className="adm-sub">
        These apply to every <strong>new</strong> order. The website, cart and
        checkout update straight away. Orders that are already placed do not
        change (you can change one order’s charge from the Orders page).
      </p>
      {saved && <div className="adm-ok">Saved. The website is updated.</div>}
      {error && (
        <div className="adm-note">
          Please enter whole numbers only (0 or more).
        </div>
      )}
      <form
        action={saveDeliverySettings}
        className="adm-card"
        style={{ display: "grid", gap: 16, maxWidth: 520 }}
      >
        <label style={{ display: "grid", gap: 5, fontWeight: 600 }}>
          Delivery charge per order (Rs)
          <input
            name="fee"
            inputMode="numeric"
            defaultValue={d.fee}
            required
          />
          <small style={{ fontWeight: 400, color: "#6b665d" }}>
            Put 0 if delivery should be free for everyone.
          </small>
        </label>
        <label style={{ display: "grid", gap: 5, fontWeight: 600 }}>
          Free delivery on orders of (Rs)
          <input
            name="threshold"
            inputMode="numeric"
            defaultValue={d.freeThreshold}
            required
          />
          <small style={{ fontWeight: 400, color: "#6b665d" }}>
            Orders of this amount or more get free delivery. Put 0 if you never
            want free delivery.
          </small>
        </label>
        <div>
          <button className="adm-btn" type="submit">
            Save delivery charges
          </button>
        </div>
      </form>
      <div className="adm-card" style={{ maxWidth: 520 }}>
        <h2>How it looks right now</h2>
        <div className="adm-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order value</th>
                <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((n) => {
                const fee = calcDelivery(n, d);
                return (
                  <tr key={n}>
                    <td>{formatPrice(n)}</td>
                    <td>{fee ? formatPrice(fee) : "Free"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
