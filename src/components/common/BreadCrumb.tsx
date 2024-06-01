import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

export const BreadCrumbCustom = () => {
    const location = useLocation();
    let currentLink = '';
    const crumb = location.pathname
        .split('/')
        .filter(crumb => crumb !== '' && crumb !== '0')
        .map(crumb => {
            currentLink += `/${crumb}`;
            return {
                title: (
                    <Link className="text-transform: capitalize" to={currentLink}>
                        {crumb}
                    </Link>
                ),
            };
        });
    return <Breadcrumb className="my-4 font-bold" items={crumb}></Breadcrumb>;
};
