// src/components/Payments/PaymentHandler.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { commitTransaction } from "@/api/paymentApi";

function PaymentHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true });

  useEffect(() => {
    const handlePayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token_ws = searchParams.get("token_ws");
      const TBK_TOKEN = searchParams.get("TBK_TOKEN");

      if (!token_ws && !TBK_TOKEN) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);

        if (TBK_TOKEN) {
          setPaymentStatus({
            success: false,
            message: "El pago fue cancelado.",
            type: "CANCELLED",
          });
        } else {
          try {
            const data = await commitTransaction(token_ws);

            switch (data.status) {
              case "APPROVED":
                setPaymentStatus({
                  success: true,
                  message: data.message || "El pago se procesó exitosamente.",
                  type: data.type,
                  details: {
                    amount: data.amount,
                    buyOrder: data.buyOrder,
                    ...(data.type === "SUBSCRIPTION" && {
                      plan: data.plan,
                      subscriptionStart: data.subscriptionStart,
                      subscriptionEnd: data.subscriptionEnd,
                    }),
                    ...(data.type === "PROJECT_PUBLICATION" && {
                      projectId: data.projectId,
                    }),
                  },
                });
                break;

              case "REJECTED":
                setPaymentStatus({
                  success: false,
                  message: data.message || "El pago fue rechazado.",
                  type: data.type,
                  reason: data.reason,
                  details: {
                    amount: data.amount,
                    buyOrder: data.buyOrder,
                  },
                });
                break;

              case "ERROR":
                setPaymentStatus({
                  success: false,
                  message: data.error || "Ocurrió un error inesperado.",
                  type: "ERROR",
                  code: data.code,
                  details: data.details,
                });
                break;

              default:
                setPaymentStatus({
                  success: false,
                  message: "Respuesta inesperada del servidor.",
                  type: "UNKNOWN",
                  details: data,
                });
            }
          } catch (error) {
            if (
              error.response &&
              error.response.data.code === "TRANSACTION_IN_PROGRESS"
            ) {
              setPaymentStatus({
                success: false,
                message:
                  "La transacción ya está siendo procesada. Por favor, espera un momento o contacta a soporte.",
                type: "IN_PROGRESS",
                code: error.response.data.code,
                retryAfter: 5 * 60, // 5 minutos
              });
            } else {
              console.error("Payment processing error:", error.response?.data || error);
              setPaymentStatus({
                success: false,
                message:
                  error.response?.data?.error ||
                  "Pago rechazado, por favor inténtelo de nuevo en unos minutos.",
                type: "NETWORK_ERROR",
                code: error.response?.data?.code || "UNKNOWN_ERROR",
                details: {
                  fullError: error.response?.data || error.message,
                  status: error.response?.status,
                },
              });
            }
          }
        }
      } catch (generalError) {
        console.error("General payment error:", generalError);
        setPaymentStatus({
          success: false,
          message:
            "Ocurrió un error inesperado. Por favor, intenta nuevamente o contacta a soporte.",
          type: "GENERAL_ERROR",
          details: generalError,
        });
      } finally {
        setLoading(false);
        // Optional redirect after 5s
        setTimeout(() => navigate("/"), 5000);
      }
    };

    handlePayment();
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {status.loading ? (
        <p>Procesando pago...</p>
      ) : (
        <div
          style={{
            backgroundColor: status.success ? "#d4edda" : "#f8d7da",
            color: status.success ? "#155724" : "#721c24",
            padding: "1rem",
            borderRadius: "8px",
            display: "inline-block",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}

export default PaymentHandler;
