import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import { API_URL } from "../config/config";

import {
  setContact,
  clearContact,
  setLoading,
  setSuccess,
  setError,
} from "../store/slice/contact.slice";

export default function Contact() {
  const dispatch = useDispatch();

  const { contact, loading, error, success } = useSelector(
    (state) => state.Contact,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await axios.post(`${API_URL}/contact`, contact);

      console.log(response.data);

      dispatch(setSuccess(true));
      dispatch(clearContact());
    } catch (error) {
      console.log(error.response?.data || error.message);

      dispatch(
        setError(error.response?.data?.message || "Failed to send message"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Contact" }]} />

      <section className="section-shell py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg">
            <h1 className="font-display text-3xl">Contact Us</h1>

            <p className="mt-3 text-slate-600">
              Reach our wellness support team for product guidance and
              partnership requests.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rounded-[2rem] bg-[#eef6ef] p-6 shadow-lg">
              <div className="space-y-3">
                <input
                  className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3"
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) =>
                    dispatch(
                      setContact({
                        name: e.target.value,
                      }),
                    )
                  }
                />

                <input
                  className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3"
                  placeholder="Email"
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    dispatch(
                      setContact({
                        email: e.target.value,
                      }),
                    )
                  }
                />

                <textarea
                  className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3"
                  rows="5"
                  placeholder="Message"
                  value={contact.message}
                  onChange={(e) =>
                    dispatch(
                      setContact({
                        message: e.target.value,
                      }),
                    )
                  }
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              {success && (
                <p className="mt-3 text-sm text-green-600">
                  Message sent successfully!
                </p>
              )}

              <div className="mt-4">
                <Button
                  className="rounded-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
