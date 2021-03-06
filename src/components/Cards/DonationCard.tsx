import React from 'react';
import { useLocation } from 'react-router-dom';
import share from '../../assets/share.svg';
import angels from '../../assets/angels.svg';
import donate from '../../assets/donate.svg';
import campimg1 from '../../assets/campimg-1.png';
import dashedsep from '../../assets/dashedsep.svg';
import { campColors } from '../../const/campColors';
import {
  amountWithCommas,
  amtAsM,
  amtToStr,
  calcDaysFromToday,
  formatTitle,
  generateRandomCardBg,
} from '../../utils/util';
import DonateButton from '../Button/DonateButton';
import { CampaignCardProps } from '../../types/Campaign';
import StatsDiv from './Stats/StatsDiv';
import beneTime from '../../assets/bene-time.svg';
import PercentCircle from './Stats/PercentCircle';
import ShareAction from '../Share/ShareAction';
import useSingleModal from '../../hooks/useSingleModal';
import ShareModal from '../Share/ShareModal';
import OrgDetails from './Details/OrgDetails';

function DonationCard(props: CampaignCardProps) {
  const {
    imgSrc,
    title,
    description,
    link,
    angelsCount,
    campaignId,
    collectedFund = 30000,
    id = campaignId,
  } = props;
  const { handleModalAction } = useSingleModal();
  const url = useLocation();
  return (
    <div>
      <div className="campaign-outer-box rounded-bene-c-1 snap-center shadow-c-1 max-w-sm m-auto">
        <div className="campaign-img relative">
          <img src={campimg1} alt={title} className=" rounded-t-bene-c-1" />
          <OrgDetails
            orgName="John Doe"
            orgLocation="Brazil"
            className="absolute bottom-0 w-full"
          />
        </div>
        <div className="campaign-body p-2">
          <div className="campaign-body-inner-box rounded-bene-c-2 p-2">
            <div className="campaign-title text-cmpheading font-extrabold text-ellipsis overflow-hidden min-h-48px max-h-48px">
              {formatTitle(title)}
            </div>
            <div className="dashed-separator">
              <img src={dashedsep} alt="separator" className="w-half mt-2" />
            </div>
            <div className="campaign-progress">
              <div className="flex justify-between p-4">
                <StatsDiv
                  value={amtToStr(angelsCount)}
                  bgtype="bg-bene-angels-lg max-h-vw-33"
                  text="angels"
                />
                <PercentCircle />
                <StatsDiv
                  value={`$${amtAsM(collectedFund)}`}
                  bgtype="bg-bene-dollar-lg max-w-per-33"
                  text="raised"
                />
              </div>
              <div className="interaction-opt flex justify-between">
                <div className="interaction-opt-inner-left flex my-auto mx-0">
                  <button
                    type="button"
                    className="campaign-share mr-2 group cursor-pointer relative">
                    <button
                      type="button"
                      className="flex"
                      onClick={() =>
                        handleModalAction(
                          <ShareModal
                            id="60"
                            organiser="Vink"
                            title="Test, hello good people"
                            className="show-modal"
                          />
                        )
                      }>
                      <img
                        src={share}
                        alt="share"
                        className="hover:opacity-75"
                      />
                    </button>
                    <ShareAction
                      id={campaignId}
                      organiser="Vink"
                      title={title}
                      className="share-action-cst invisible group-hover:visible bottom-12 transition-all duration-200 transform ease-in-out overflow-x-scroll max-w-40vw md:max-w-min md:overflow-x-visible"
                    />
                  </button>
                  <div className="campaign-start flex items-center">
                    <div className="started-day flex whitespace-nowrap items-center overflow-hidden max-w-em-2">
                      <img
                        src={beneTime}
                        alt="started"
                        className="mr-2 min-w-30px"
                      />
                      {calcDaysFromToday('2021-09-01')}
                    </div>
                  </div>
                </div>
                <div className="interaction-opt-inner-right">
                  <DonateButton campaignid={campaignId} sid={id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationCard;
