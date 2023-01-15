import { useNavigate as useNavigateOriginal } from 'react-router-dom';
import { resolveRoutePath } from 'app/router/routes';

const useNavigate = () => {
  const navigate = useNavigateOriginal();
  return (path, ...others) => {
    const resolvedPath = resolveRoutePath(path);
    return navigate(resolvedPath, ...others);
  };
};

export default useNavigate;
