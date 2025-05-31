import React, { useEffect, useState } from "react";
import "../../styles/manage_reports/ManageReportsPage.css";
import Header from "../../components/Header";
import { toast } from "react-toastify";

type Report = {
    id: number;
    details: string;
    date: string;
    location: string;
    status: string;
    contact: {
        id: number;
        name: string;
        phoneNumber: string;
    };
};

const ManageAnimalReportsPage: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/reports")
            .then((res) => res.json())
            .then(setReports)
            .catch(() => toast.error("Failed to load reports."));
    }, []);

    const handleFound = (reportId: number) => {
        fetch(`http://localhost:8080/api/reports/${reportId}/found`, {
            method: "PUT"
        })
            .then((res) => {
                if (!res.ok) throw new Error();
                toast.success("Marked as found.");
                setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: "FINISHED" } : r));
            })
            .catch(() => toast.error("Failed to mark report as found."));
    };

    return (
        <>
            <Header />
            <div className="reports-container">
                <h2>Manage Animal Reports</h2>
                {reports.length === 0 ? (
                    <p className="loading-text">No reports found.</p>
                ) : (
                    <ul className="reports-list">
                        {reports.map((report) => (
                            <li key={report.id} className="report-item">
                                <div className="report-content">
                                    <div><strong>ID:</strong> {report.id}</div>
                                    <div><strong>Date:</strong> {report.date}</div>
                                    <div><strong>Location:</strong> {report.location}</div>
                                    <div><strong>Status:</strong> {report.status}</div>
                                    <div><strong>Contact:</strong> {report.contact.name} - {report.contact.phoneNumber}</div>
                                    <textarea
                                        className="description-area"
                                        readOnly
                                        value={report.details}
                                    />
                                    <div className="report-actions">
                                        <button
                                            className="confirm-btn"
                                            onClick={() => handleFound(report.id)}
                                            disabled={report.status === "FINISHED"}
                                        >
                                            Handle Found
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default ManageAnimalReportsPage;
