import React from "react";
import { Repository } from "../interfaces";

interface RepositoryDetailsProps {
  repository: Repository;
  avatarUrl?: string;
}

const RepositoryDetails: React.FC<RepositoryDetailsProps> = ({
  repository,
  avatarUrl,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <img src={avatarUrl} alt={repository.name} style={styles.avatar} />
        <table style={styles.table}>
          <tbody>
            <tr>
              <td>
                <strong>Stars:</strong>
              </td>
              <td>{repository.stargazers_count}</td>
            </tr>
            <tr>
              <td>
                <strong>Forks:</strong>
              </td>
              <td>{repository.forkCount}</td>
            </tr>
            {repository.homepageUrl && (
              <tr>
                <td>
                  <strong>Homepage:</strong>
                </td>
                <td>
                  <a
                    href={repository.homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    {repository.homepageUrl}
                  </a>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <strong>Created At:</strong>
              </td>
              <td>{new Date(repository.createdAt).toDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={styles.content}>
        <h3 style={styles.repoName}>{repository.name}</h3>
        <p style={styles.description}>{repository.description}</p>
        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.viewLink}
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gap: "20px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    margin: "20px 20px",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderRight: "1px solid #ddd",
  },
  avatar: {
    borderRadius: "50%",
    width: "100px",
    height: "100px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  table: {
    borderCollapse: "separate",
    borderSpacing: "10px 10px",
    display: "table",
  },
  content: {
    padding: "20px",
  },
  repoName: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  description: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  viewLink: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
  },
};

export default RepositoryDetails;
