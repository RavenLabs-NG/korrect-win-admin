import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models";
import { format } from "date-fns";
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import Layout from '@/src/components/Layout'
import { Spinner, Loader } from '@/src/components/UI';

import customStyle from '../src/utils/customStyle'
import { getWinners, payWinner } from '@/src/queries/admin.queries';
import { TWinnersGroup } from '@/src/types';
import { formatAmount } from '@/src/utils/common';

const Rewards = () => {

    const queryClient = useQueryClient();
    const mutation = useMutation(payWinner);

    const styles = customStyle();

    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: "id", sort: "desc" }
    ]);

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');


    const { data, isFetching, isPreviousData, isLoading } = useQuery<TWinnersGroup>({
        queryKey: ['winners', page],
        queryFn: () => getWinners({ page, status }),
        keepPreviousData: true,
        staleTime: 5000,
    });

    // Prefetch the next page!
    // useEffect(() => {
    //     if (!isPreviousData && (Number(data?.currentPage) < Number(data?.pages))) {
    //         queryClient.prefetchQuery({
    //             queryKey: ['winners', page + 1],
    //             queryFn: () => getWinners({ page: page + 1, status }),
    //         })
    //     }
    // }, [data, isPreviousData, page, queryClient, status]);

    const columns: GridColDef[] = [
        // {
        //     field: "id",
        //     headerName: "#",
        //     width: 70,
        //     headerAlign: "center",
        //     align: "center",
        //     flex: 0.5,
        //     sortComparator: (a, b) => parseInt(a) - parseInt(b)
        // },
        {
            field: "predictionId",
            headerName: "Phone No",
            width: 180,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex flex-col justify-center h-full gap-2">
                        {params.row.subscriber.msisdn}
                    </div>
                )

            },
            flex: 1
        },
        {
            field: "id",
            headerName: "Username",
            width: 180,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex flex-col justify-center h-full gap-2">
                        {params.row.subscriber.name}
                    </div>
                )

            },
            flex: 1
        },
        {
            field: "gameSetId",
            headerName: "Email",
            width: 140,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex flex-col justify-center h-full gap-2">
                        {params.row.subscriber.email}
                    </div>
                )

            },
            flex: 1
        },
        {
            field: "reward",
            headerName: "Amount",
            type: "string",
            width: 140,
            // valueGetter: (params: any) => `${format(new Date(params), "hh:mm a")}`,
            flex: 1
        },
        {
            field: "predictionTimestamp",
            headerName: "Prediction date",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "do MMM, yyy hh:mm a")}`,
            flex: 1
        },
        {
            field: "paymentStatus",
            headerName: "STATUS",
            headerAlign: "center",
            align: "left",
            renderCell(params) {
                return (
                    <div className=" whitespace-nowrap h-full flex justify-center items-center">
                        <div
                            className={`flex gap-1 justify-center lowercase items-center px-3 py-2 rounded-full text-sm text-left ${params.row.paymentStatus === "PAID" ? "bg-[#F0FFF7] text-[#0EA255] " : params.row.paymentStatus === "FAILED" ? "text-crimson bg-crimson-shade" : "bg-[#FFFAEB] text-[#F79009]"}`}
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
            field: "createdAt",
            headerName: "Payment Date",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "do MMM, yyy")}`,
            flex: 1
        },
        {
            field: "position",
            headerName: "Action",
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex justify-center items-center gap-2 h-full w-full">
                        {params.row.paymentStatus === 'PENDING' && <button onClick={() => handleClick(params.row)} className={`bg-transparent border-0 text-green-korrect outline-none px-2 py-1`}>
                            <VisibilityIcon />
                        </button>}
                    </div>
                );
            },
            flex: 0.5
        },
    ];

    const handleClick = (row: any) => {
        if(window.confirm('Confirm to pay')) {
            const payload = {
                winnerId: row.id,
                reward: row.reward
            }
            mutation.mutate(payload, {
                onSuccess: (data) => {
                    if(data.status) {
                        queryClient.invalidateQueries(['winners', page]);
                        toast.success(data.message === 'Ok' ? 'Payment Successful' : data.message);
                    } else {
                        toast.error(data.message);
                    }
                },
                onError: (err) => {
                    if (typeof err === 'string') {
                        toast.error(err);
                    }
                }
            })
        }
    }

    const handlePageClick = ({ selected }: { selected: number }) => {
        setPage(selected + 1);
    }

    if (isLoading || mutation.isLoading) {
        return (
            <Layout>
                <Loader />
            </Layout>
        )
    }

    return (
        <Layout>
            <div className='w-full min-h-[90vh] pt-8'>
                <section className="rounded-xl mb-8 bg-white p-6">
                    <h2 className="text-black mb-4 font-medium text-xl">Latest Withdrawals</h2>
                    
                    <div className="border border-[#55565A] border-opacity-15 rounded-md mt-5">
                        <div className="overflow-auto">
                            <div className='w-full min-w-[60rem]'>
                                <DataGrid
                                    rows={data?.winners ?? []}
                                    columns={columns}
                                    // pageSize={20}
                                    className={styles.root}
                                    rowHeight={50}
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
                {isFetching && <section className="bg-white text-center py-2 px-6 rounded-xl mt-8">
                    <Spinner color='green-korrect' size={1.9} />
                </section>}
                <section className="paginate bg-white py-5 px-6 rounded-xl mt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                    <div>
                        <p className='text-sm text-center'>{data?.currentPage} - {Number(data?.currentPage) * Number(data?.pageSize)} of {formatAmount(Number(data?.pages))} pages</p>
                    </div>
                    <div className='flex justify-center'>
                        <ReactPaginate
                            activeClassName={'!bg-[#07540A] !text-white'}
                            breakClassName={' break-me '}
                            breakLabel={'...'}
                            containerClassName={'flex justify-end items-center gap-2'}
                            disabledClassName={'disabled-page'}
                            marginPagesDisplayed={1}
                            nextClassName={"text-[#9C9898] text-xs"}
                            nextLabel="next"
                            onPageChange={handlePageClick}
                            pageCount={Number(data?.pages)}
                            pageClassName={'flex justify-center items-center py-2 px-4 text-sm bg-[#EDEDED] text-[#767171] rounded-md'}
                            pageRangeDisplayed={2}
                            previousClassName='text-[#9C9898] text-xs'
                            previousLabel="previous"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </section>
            </div>
        </Layout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({
    req: { cookies }
}) => {
    if (!cookies.korrecto) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        };
    }

    return {
        props: {

        }
    };
};


export default Rewards