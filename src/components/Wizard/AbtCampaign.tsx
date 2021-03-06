import React, { useEffect } from 'react';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import Multiselect from 'multiselect-react-dropdown';
import useWizardContext from '../../hooks/useWizard';
import WizardInfo from './Layout/WizardInfo';
import { category, countriesList } from '../../const/onboard';
import {
  OrganiserTypes,
  CampaignTagsTypes,
  CampaignDetailsTypes,
  PONTypes,
  POUTypes,
  WhyDonateType,
  CampaignArweaveTypes,
} from '../../types/Campaign';
import { fundWallet } from '../../utils/arweave';
import { wkey } from '../tstkey';

const ConnectAr = async () => {
  const arweave = Arweave.init({
    host: 'localhost',
    port: 1984,
    protocol: 'http',
  });
  const jwk = wkey;
  const addr = await arweave.wallets.jwkToAddress(jwk);

  fundWallet(arweave, jwk);
  return { arweave, jwk, addr };
};
export default function AbtCampaign() {
  const { organiserInfo, setOrganiserInfo, campaignInfo, setCampaignInfo } =
    useWizardContext();
  const [pickCategories, setPickCategories] = React.useState([]);

  const handleChange = (e: any, inp: string) => {
    const { name, value } = e.target;
    setCampaignInfo({ ...campaignInfo, [name]: value });
  };
  const handleGoalChange = (e: any) => {
    const { name, value } = e.target;
    setCampaignInfo({ ...campaignInfo, [name]: Number(value) });
  };
  useEffect(() => {
    console.log('campaignInfo', campaignInfo);
    console.log('organiserInfo', organiserInfo);
    console.log('pubkey', organiserInfo.organiserPubkey);
    const creationDate = new Date().toISOString();
    setCampaignInfo({
      ...campaignInfo,
      createdDate: creationDate,
      id: 'asdasdcasd',
      startDate: creationDate,
      status: 'active',
    });
  }, [campaignInfo.title]);
  /* Connect Arwweave */

  const [uploadStatus, setUploadStatus] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  /* Image upload */
  const handleFileUploadToArweave = async (fileblb: Blob, fname: string) => {
    const { arweave, jwk } = await ConnectAr();
    const fileread = new window.FileReader();
    const uploadAsBuffer = async (fr: ArrayBuffer) => {
      const fileBuffer = await Buffer.from(fr);
      const fileType = fileblb?.type;
      const fileSize = fileblb?.size;
      if (fileSize < 1024 * 1024 * 1024 * 7) {
        const txn = await arweave.createTransaction(
          {
            data: fileBuffer,
          },
          jwk
        );
        txn.addTag('App-Name', 'Beneficence');
        txn.addTag('App-Version', '1.0');
        txn.addTag('Content-Type', fileType);
        txn.addTag('Content-Code', 'image');
        txn.addTag('Image-For', 'cover');
        txn.addTag('Content-Name', fname);
        txn.addTag('Campaign-Id', campaignInfo.id);
        txn.addTag('Campaign-author', organiserInfo.organiserPubkey);
        await arweave.transactions.sign(txn, jwk);
        setIsUploading(true);

        const uploadr = await arweave.transactions.getUploader(txn);
        /* eslint-disable no-await-in-loop */
        while (uploadr.isComplete === false) {
          await uploadr.uploadChunk();
          setUploadStatus(`Uploading... ${uploadr.pctComplete}%`);
        }
        /* eslint-disable no-await-in-loop */
        console.log(uploadr);
        await arweave.api.get('mine');
        const mined = await arweave.transactions.get(txn.id);
        console.log('Block mined');
        setUploadStatus('');
        setIsUploading(false);
        setCampaignInfo({
          ...campaignInfo,
          cover: `localhost:1984/${txn.id}`,
        });
        window.open(`localhost:1984/${txn.id}`, '_blank');
      } else {
        alert('File size is too large');
      }
    };
    fileread.readAsArrayBuffer(fileblb);
    fileread.onloadend = () => {
      uploadAsBuffer(fileread.result as ArrayBuffer);
    };
  };
  useEffect(() => {
    if (pickCategories.length > 0) {
      const tags = pickCategories.map((item: any) => {
        return item.name;
      });
      setCampaignInfo({ ...campaignInfo, tags });
    }
  }, [pickCategories]);

  const inputs = [
    {
      name: 'title',
      label: 'Campaign Title',
      type: 'text',
      value: campaignInfo.title,
      col: '',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      value: campaignInfo.description,
      col: '',
    },
    {
      name: 'goal',
      label: 'Campaign Goal',
      type: 'number',
      value: campaignInfo.goal,
      col: 'sm:col-span-3 lg:col-span-2',
      select: 'single',
    },
    {
      name: 'cover',
      label: 'Cover Image',
      type: 'file',
      value: campaignInfo.cover,
      col: '',
    },
  ];

  return (
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <WizardInfo
          text1="Tell your story"
          text2="Add pictures, story and more to tell people about your campaign."
        />
        <div className="mt-5 md:mt-0 md:col-span-2 text-left">
          <form action="#" method="POST">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className={`col-span-6 ${inputs[3].col}`}>
                    <label
                      htmlFor={inputs[0].name}
                      className="block text-sm font-medium leading-5 text-gray-700">
                      {inputs[0].label}
                      <input
                        id={inputs[0].name}
                        name={inputs[0].name}
                        type={inputs[0].type}
                        value={inputs[0].value}
                        onChange={(e) => handleChange(e, inputs[0].name)}
                        className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </label>
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor={inputs[3].name}
                      className="block text-sm font-medium leading-5 text-gray-700">
                      {inputs[3].label}
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true">
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium hover:text-bene-light-blue text-bene-dark-blue">
                              <span>Upload a cover image</span>
                              <input
                                id={inputs[3].name}
                                name={inputs[3].name}
                                type={inputs[3].type}
                                className="sr-only border-none focus:border-transparent"
                                accept="image/*"
                                onChange={(e) => {
                                  if (
                                    e &&
                                    e.target &&
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    const file = e.target.files[0];
                                    const fname = file.name;
                                    handleFileUploadToArweave(file, fname);
                                  }
                                }}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Any image type up to 7MB
                          </p>
                        </div>
                      </div>
                    </label>
                    {isUploading && (
                      <div className="mt-2">
                        <div className="flex justify-center">
                          <div className="w-full">
                            <div className="bg-white rounded-md shadow-sm">
                              <div className="bg-white text-center font-medium text-gray-700 px-4 py-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>{' '}
                                Uploading...
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`col-span-6 ${inputs[1].col}`}>
                    <label
                      htmlFor={inputs[1].name}
                      className="block text-sm font-medium leading-5 text-gray-700">
                      {inputs[1].label}
                      <textarea
                        id={inputs[1].name}
                        name={inputs[1].name}
                        rows={3}
                        className=" focus:ring-bene-dark-blue mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        placeholder="Tell your story and explain your medical "
                        value={inputs[1].value}
                        onChange={(e) => handleChange(e, inputs[1].name)}
                      />
                    </label>
                  </div>
                  <div className={`col-span-6 ${inputs[2].col}`}>
                    <label
                      htmlFor={inputs[2].name}
                      className="block text-sm font-medium leading-5 text-gray-700">
                      {inputs[2].label}
                    </label>
                    <div className="flex flex-row rounded-md shadow-sm">
                      <span className="inline-flex mt-1 items-center py-2 px-3 rounded-l-md border border-r-0 border-gray-300 bg-bene-very-light-blue font-bold text-bene-dark-blue text-sm">
                        $
                      </span>
                      <input
                        id={inputs[2].name}
                        name={inputs[2].name}
                        type={inputs[2].type}
                        value={inputs[2].value}
                        onChange={handleGoalChange}
                        className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-l-none border-l-0 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
