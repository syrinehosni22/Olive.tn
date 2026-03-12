import React from "react";

export interface ComparisonRow {
  feature: string;
  classic: boolean | null;
  premium: boolean | null;
}

export const ComparisonTable: React.FC<{ data: ComparisonRow[] }> = ({ data }) => {
  const renderIcon = (value: boolean | null) => {
    if (value === true) return <i className="bi bi-check-circle-fill text-success fs-5"></i>;
    if (value === false) return <i className="bi bi-x-circle text-danger fs-5"></i>;
    return <span className="text-muted">—</span>;
  };

  return (
    <div className="table-responsive mt-5 container">
      <table className="table table-hover border">
        <thead className="table-light">
          <tr>
            <th className="py-3 ps-4">Fonctionnalités</th>
            <th className="text-center py-3">Classique</th>
            <th className="text-center py-3 text-primary">Premium</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="py-3 ps-4 fw-medium">{row.feature}</td>
              <td className="text-center py-3">{renderIcon(row.classic)}</td>
              <td className="text-center py-3">{renderIcon(row.premium)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};