import { useState, useEffect } from 'react'
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';
import { useQuery, useQueryClient } from 'react-query';

import { Input, Loader, Spinner } from '@/src/components/UI'
import Layout from '@/src/components/Layout'

import { useData } from '@/src';
import customStyle from '../src/utils/customStyle'
import { getAllSubscribers } from '@/src/queries/admin.queries';
import { TSubscribersData } from '@/src/types';
import { formatAmount } from '@/src/utils/common';

const Dashboard = () => {

    const { data: { token } } = useData();
    const queryClient = useQueryClient()

    const styles = customStyle();

    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: "id", sort: "desc" }
    ]);

    const [page, setPage] = useState(1);


    const { data, isFetching, isPreviousData, isLoading } = useQuery<TSubscribersData>({
        queryKey: ['subscribers', page],
        queryFn: () => getAllSubscribers({ token, page }),
        keepPreviousData: true,
        staleTime: 5000,
    });

    // Prefetch the next page!
    useEffect(() => {
        if (!isPreviousData && (Number(data?.currentPage) < Number(data?.pages))) {
            queryClient.prefetchQuery({
                queryKey: ['subscribers', page + 1],
                queryFn: () => getAllSubscribers({ token, page: page + 1 }),
            })
        }
    }, [data, isPreviousData, page, queryClient, token])

    const testData = [
        {
            id: 1,
            name: 'John Snow',
            date: '2024-04-12',
            phone: '2349123456789',
            predictions: 15,
            createdAt: Date.now(),
            status: 'active'
        },
        {
            id: 2,
            name: 'Jack Sparrow',
            date: '2024-04-12',
            phone: '2349123456789',
            predictions: 17,
            createdAt: Date.now(),
            status: 'active'
        },
        {
            id: 3,
            name: 'John Wick',
            date: '2024-04-12',
            phone: '2349123456789',
            predictions: 19,
            createdAt: Date.now(),
            status: 'inactive'
        },
        {
            id: 4,
            name: 'Frida Khalo',
            date: '2024-04-12',
            phone: '2349123456789',
            predictions: 13,
            createdAt: Date.now(),
            status: 'active'
        },
        {
            id: 5,
            name: 'Hushpupi',
            date: '2024-04-12',
            phone: '2349123456789',
            predictions: 11,
            createdAt: Date.now(),
            status: 'active'
        },
    ]

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
            field: "username",
            headerName: "Username",
            width: 130,
            flex: 1
        },
        {
            field: "dateAdded",
            headerName: "Joined On",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "do MMM, yyy")}`,
            flex: 1
        },
        {
            field: "msisdn",
            headerName: "Phone Number",
            description: "This column has a value getter and is not sortable.",
            sortable: false,
            width: 160,
            flex: 1
        },
        {
            field: "predictionPoints",
            headerName: "Prediction Points",
            type: "string",
            width: 50,
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "lastSubscription",
            headerName: "Last Subscription",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "do MMM, hh:mm a")}`,
            flex: 1
        },
        {
            field: "enabled",
            headerName: "status",
            headerAlign: "center",
            align: "left",
            renderCell(params) {
                return (
                    <div className="h-full flex justify-center items-center">
                        <div
                            className={`text-sm text-left font-medium capitalize ${params.row.enabled === true ? "text-[#99E403]" : "text-[#E41103]"}`}
                        >
                            {params.formattedValue ? "Active" : "Inactive"}
                        </div>
                    </div>
                );
            },
            flex: 1
        },
    ];

    const handlePageClick = ({ selected }: { selected: number }) => {
        setPage(selected + 1);
    }

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
                <section className="mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                    <div className='bg-white rounded-xl px-3 py-4'>
                        <div className='mb-6'>
                            <h3 className="text-sm">Total Games Scheduled</h3>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">9883</h3>
                        </div>
                    </div>
                    <div className='bg-white rounded-xl px-3 py-4'>
                        <div className='mb-6'>
                            <h3 className="text-sm">Members</h3>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">{formatAmount(Number(data?.total))}</h3>
                        </div>
                    </div>
                    <div className='bg-white rounded-xl px-3 py-4'>
                        <div className='mb-6'>
                            <h3 className="text-sm">New/Returning</h3>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">5/25</h3>
                        </div>
                    </div>
                    <div className='bg-white rounded-xl px-3 py-4'>
                        <div className='mb-6'>
                            <h3 className="text-sm">Active Members</h3>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">13 Now</h3>
                        </div>
                    </div>
                </section>
                <section className="rounded-xl bg-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <Input placeholder='Search...' className='font-normal' />
                        </div>
                    </div>

                    <div className="border border-[#55565A] border-opacity-15 rounded-md mt-5">
                        <div className="overflow-auto">
                            <div>
                                <DataGrid
                                    rows={data?.subscribers ?? []}
                                    columns={columns}
                                    // pageSize={20}
                                    className={styles.root}
                                    rowHeight={60}
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

export default Dashboard