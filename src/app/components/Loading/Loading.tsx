import styles from "./Loading.module.css";

interface LoadingProps {
  progress: number;
  total: number;
}

export default function Loading({ progress, total }: LoadingProps) {
  const widthPercentage = (progress / total) * 100;

  return (
    <div className={styles.loading}>
      <span>Loading...</span>
      <span className={styles.progressBar}>
        <span
          className={styles.progressSliver}
          style={{ width: `${widthPercentage}%` }}
        />
      </span>
    </div>
  );
}
