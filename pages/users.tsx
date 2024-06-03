import { useState } from 'react'
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models";
import { format } from "date-fns";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import Layout from '@/src/components/Layout';
import { Loader } from '@/src/components/UI';

import { getSubscriberById, getUserPredictions } from '@/src/queries/admin.queries';
import { TPredictionGroup, TPredictionSolo, TSubscribersData } from '@/src/types';
import customStyle from '../src/utils/customStyle'


const Users = () => {

    const { query } = useRouter();

    const styles = customStyle();

    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: "id", sort: "desc" }
    ]);

    const { data: userData, isLoading } = useQuery<TSubscribersData>(['user', query.userId], () => getSubscriberById(String(query?.userId)), { enabled: !!query.userId })
    const { data } = useQuery<TPredictionGroup>(['userPredictions', query.userId], () => getUserPredictions(String(query?.userId)), { enabled: !!query.userId })

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "Predictions",
            width: 180,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex flex-col justify-center h-full gap-2">
                        {
                            params?.row?.predictions?.map((game: TPredictionSolo, i: number) => {
                                return (
                                    <div key={i} className="">
                                        <p className='text-green-korrect font-semibold text-sm text-center'>{game.home} : {game.away}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                )

            },
            flex: 1
        },
        {
            field: "status",
            headerName: "STATUS",
            headerAlign: "center",
            align: "left",
            renderCell(params) {
                return (
                    <div className=" whitespace-nowrap h-full flex justify-center items-center">
                        <div
                            className={`flex gap-1 justify-center items-center px-3 py-2 rounded-full text-xs font-medium text-left ${params.row.status === "WIN" ? "bg-[#F0FFF7] text-[#0EA255] " : params.row.status === "LOSE" ? "text-red bg-red bg-opacity-5" : "bg-[#FFFAEB] text-[#F79009]"}`}
                        >
                            <FiberManualRecordIcon sx={{ height: 12, width: 12 }} />
                            {params.formattedValue}
                        </div>
                    </div>
                );
            },
            flex: 1
        },
        {
            field: "dateAdded",
            headerName: "Booking Date",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "do MMM, yyy")}`,
            flex: 1
        },
        {
            field: "timestamp",
            headerName: "Time",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "hh:mm a")}`,
            flex: 1
        }
    ];

    if (isLoading) {
        return (
            <Layout>
                <Loader />
            </Layout>
        )
    }

    return (
        <Layout>
            <div className='w-full min-h-[90vh] pt-8'>
                <section className="rounded-xl bg-white p-6 mb-8">
                    <h1 className='text-xl font-medium mb-6'>User Info</h1>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <div className='w-full'>
                            <div className='bg-green-korrect bg-opacity-10 text-sm font-semibold px-4 py-2 rounded-t-xl'>
                                <h3>Personal Info</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-5 px-4 py-4 rounded-b-xl border border-[#55565A] border-opacity-15">
                                <div>
                                    <h5 className='text-sm font-medium mb-1 text-black-grey'>Username</h5>
                                    <p className='border border-[#55565A] border-opacity-15 w-full p-2 rounded-lg text-black font-semibold text-sm'>{userData?.subscribers[0]?.username}</p>
                                </div>
                                <div>
                                    <h5 className='text-sm font-medium mb-1 text-black-grey'>Msisdn</h5>
                                    <p className='border border-[#55565A] border-opacity-15 w-full p-2 rounded-lg text-black font-semibold text-sm'>{userData?.subscribers[0]?.msisdn}</p>
                                </div>
                                <div>
                                    <h5 className='text-sm font-medium mb-1 text-black-grey'>Pin</h5>
                                    <p className='border border-[#55565A] border-opacity-15 w-full p-2 rounded-lg text-black font-semibold text-sm'>{userData?.subscribers[0]?.pin}</p>
                                </div>
                                <div>
                                    <h5 className='text-sm font-medium mb-1 text-black-grey'>Password</h5>
                                    <p className='border border-[#55565A] border-opacity-15 w-full p-2 rounded-lg text-black font-semibold text-sm'>{userData?.subscribers[0]?.password}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className='bg-green-korrect bg-opacity-10 text-sm font-semibold px-4 py-2 rounded-t-xl'>
                                <h3>Account Info</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-5 px-4 py-4 rounded-b-xl border border-[#55565A] border-opacity-15">
                                <div>
                                    <h5 className='text-sm font-medium mb-1 text-black-grey'>Last Subscription</h5>
                                    <p className='border border-[#55565A] border-opacity-15 w-full p-2 rounded-lg text-black font-semibold text-sm'>{format(new Date(userData?.subscribers[0]?.lastSubscription ?? new Date()), "do MMM, yyy")}</p>
                                </div>
                                <div>
                                    <h5 className='text-sm font-medium mb-1 text-black-grey'>Last Login</h5>
                                    <p className='border border-[#55565A] border-opacity-15 w-full p-2 rounded-lg text-black font-semibold text-sm'>{userData?.subscribers[0]?.lastLogin ?? 'Unavailable'}</p>
                                </div>
                                <div>
                                    <h5 className='text-sm font-medium mb-1 text-black-grey'>Prediction Points</h5>
                                    <p className='border border-[#55565A] border-opacity-15 w-full p-2 rounded-lg text-black font-semibold text-sm'>{userData?.subscribers[0]?.predictionPoints}</p>
                                </div>
                                <div>
                                    <h5 className='text-sm font-medium mb-1 text-black-grey'>Account Status</h5>
                                    <p className='border border-[#55565A] border-opacity-15 w-full p-2 rounded-lg text-black font-semibold text-sm capitalize'>{userData?.subscribers[0]?.accountNonLocked ? 'Active' : 'InActive'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="rounded-xl bg-white p-6">
                    <h2 className='text-xl font-medium'>User Predictions</h2>
                    <div className="border border-[#55565A] border-opacity-15 rounded-md mt-5">
                        <div className="overflow-auto">
                            <div className='w-full min-w-[30rem]'>
                                <DataGrid
                                    rows={data?.predictions ?? []}
                                    columns={columns}
                                    // pageSize={20}
                                    className={styles.root}
                                    rowHeight={100}
                                    showCellVerticalBorder={false}
                                    showColumnVerticalBorder={false}
                                    columnHeaderHeight={55}
                                    sx={{ border: "0px", overflowX: "scroll" }}
                                    hideFooter={true}
                                    disableColumnMenu
                                    disableRowSelectionOnClick
                                    autoHeight
                                    sortModel={sortModel}
                                    onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export default Users