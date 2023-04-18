import '../styles/common.css';
import 'twin.macro';
import './slider.css';

import moment from 'moment';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { OrderApi } from '../api/api';
import iconDelete from '../assets/svgs/delete.svg';
import { UserContext } from '../contexts/UserContext';
import { IOrder } from '../type';

const ProfileHistoryPage = () => {
  const [data, setData] = useState<IOrder[]>([]);
  const [isUpdate, setIsUpdate] = useState(true);

  useEffect(() => {
    if (!isUpdate) return;
    OrderApi.getAll()
      .then((res) => {
        setData(res.items);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsUpdate(false));
  }, [isUpdate]);

  const expirationDate = (date: Date) => {
    var daysDiff = moment.utc(date).diff(moment(), 'days');
    if (moment.utc(date).isAfter(moment())) {
      if (daysDiff <= 5) {
        if (daysDiff === 0) {
          return 'Today';
        } else if (daysDiff === 1) {
          return 'in 1 day';
        } else {
          return `in ${daysDiff} days`;
        }
      } else {
        return moment.utc(date).format('DD MMM YYYY');
      }
    } else {
      return 'Expired';
    }
  };

  return (
    <div tw="md:py-9">
      <div tw="pb-6 md:flex justify-between border-b border-[#404F76] hidden">
        <span tw="w-3/12 text-[#A1A8BC]">Item</span>
        <span tw="w-2/12 text-[#A1A8BC]">Game</span>
        <span tw="w-2/12 text-[#A1A8BC]">Date</span>
        <span tw="w-2/12 text-[#A1A8BC]">Expiration</span>
        <span tw="w-2/12 text-[#A1A8BC]">Duration</span>
        <span tw="w-1/12 text-[#A1A8BC]">Price</span>
      </div>
      {data.map((item, index) => (
        <Fragment key={index}>
          <div tw="h-[90px] md:flex justify-between items-center border-b border-[#404F76] hidden">
            {item.product?.game === 'Axie Infinity' && (
              <>
                <span
                  css={{
                    backgroundImage: `url(${item.product?.axie?.image})`,
                    backgroundPositionX: -20,
                  }}
                  tw="pl-[78px] w-3/12 h-[80px] flex items-center bg-no-repeat bg-contain"
                >
                  {item.product?.product_name}
                </span>
                <span tw="w-2/12">{item.product?.game}</span>
                <span tw="w-2/12">
                  {moment(item.product?.created).format('DD MMM YYYY')}
                </span>
                <span tw="w-2/12">
                  {expirationDate(item.expired || new Date())}
                </span>
                <span tw="w-2/12">{item.quantity} month</span>
                <span tw="w-1/12">
                  ${(item.product?.price || 0).toFixed(2)}
                </span>
              </>
            )}
          </div>
          <div tw="flex justify-between items-center border-b border-[#404F76] md:hidden py-4">
            {item.product?.game === 'Axie Infinity' && (
              <>
                <div tw="w-4/12 flex items-center bg-no-repeat bg-contain">
                  <img alt="product" src={item.product?.axie?.image} />
                </div>
                <div tw="w-4/12 flex-row">
                  <div tw="text-[#A1A8BC]">Item</div>
                  <div>{item.product?.product_name.replace('Axie ', '')}</div>
                  <div tw="text-[#A1A8BC] mt-2">Date</div>
                  <div>
                    {moment(item.product?.created).format('DD MMM YYYY')}
                  </div>
                  <div tw="text-[#A1A8BC] mt-2">Duration</div>
                  <div>{item.quantity} month</div>
                </div>
                <div tw="w-4/12 flex-row">
                  <div tw="text-[#A1A8BC]">Game</div>
                  <div>{item.product?.game}</div>
                  <div tw="text-[#A1A8BC] mt-2">Expiration</div>
                  <div>{expirationDate(item.expired || new Date())}</div>
                  <div tw="text-[#A1A8BC] mt-2">Price</div>
                  <div tw="text-[24px]">
                    ${(item.product?.price || 0).toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default ProfileHistoryPage;
