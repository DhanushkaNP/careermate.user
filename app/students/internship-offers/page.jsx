"use client";

import InternshipOfferSummary from "@/Components/Internships/InternshipOfferSummary";
import api from "@/utils/api";
import { useUserId, useUserToken } from "@/utils/Auth/auth-selectors";
import React, { useEffect, useState } from "react";

const InternshipOffers = () => {
  const [internshipOffers, setInternshipOffers] = useState([]);

  const token = useUserToken();
  const studentId = useUserId();

  const fetchInternshipOffers = async () => {
    try {
      const response = await api.get(
        `Students/${studentId}/InternshipOffer/List`,
        null,
        token
      );
      setInternshipOffers(response.items);
      console.log(response.items);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
      setInternshipOffers([]);
    }
  };

  const rejectInternshipOffer = async (id) => {
    try {
      await api
        .delete(`Students/${studentId}/InternshipOffer/${id}`, token)
        .then(() => {
          fetchInternshipOffers();
        });
    } catch (error) {
      console.error("Failed to reject internship offer:", error);
    }
  };

  const acceptInternshipOffer = async (id) => {
    await api
      .post(`Students/${studentId}/InternshipOffer/${id}/Accept`, null, token)
      .then(() => {
        fetchInternshipOffers();
      });
  };

  useEffect(() => {
    fetchInternshipOffers();
  }, [studentId]);

  return (
    <div className="flex flex-col min-h-screen ">
      <h2 className=" text-4xl font-bold text-dark-blue">
        Internship <span className=" text-light-blue">Offers</span> You received
      </h2>

      <div className="mt-4">
        {internshipOffers.map((offer) => (
          <InternshipOfferSummary
            key={offer.id}
            id={offer.id}
            internshipPostId={offer.internshipPostId}
            companyName={offer.companyName}
            location={offer.location}
            type={offer.type}
            title={offer.internshipTitle}
            companyLogoFirebaseId={offer.companyLogoFirebaseId}
            onReject={rejectInternshipOffer}
            onAccept={acceptInternshipOffer}
          />
        ))}
      </div>
    </div>
  );
};

export default InternshipOffers;
