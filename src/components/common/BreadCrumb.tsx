import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

export const BreadCrumbCustom = () => {
    const location = useLocation();
    let currentLink = "";
    const crumb = location.pathname.split('/').filter(crumb => crumb !== '').map((crumb) => {
        currentLink += `/${crumb}`
        return {
            title: <Link className='text-transform: capitalize' to={currentLink}>{crumb}</Link>
        }
    })
    return <Breadcrumb className='mb-4' items={crumb}></Breadcrumb>
}
