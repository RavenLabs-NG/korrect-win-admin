import { createStyles, makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme =>
	createStyles({
		root: {
			border: "none",
			minWidth: "45rem",
			overflow: "scroll",
			fontFamily: "Inter, sans-serif",

			"& .MuiDataGrid-renderingZone": {
				"& .MuiDataGrid-row": {
					// backgroundColor: "rgba(235, 235, 235, .7)"
				}
			},

			"& .MuiDataGrid-main": {
				fontSize: "12px", //body cell of the table
				border: "0px",

				"& .MuiDataGrid-columnHeaders": {
					// border: ".5px solid rgb(30, 41, 59,  .1)",
					textTransform: "capitalize",
					fontSize: "13px", //header stylel
					fontWeight: "600",

					"& .MuiDataGrid-columnHeader": {
						backgroundColor: "#f9f9f9",

						"& .MuiDataGrid-columnHeaderTitle": {
							fontWeight: 600
						}
					}
				},

				"& div div div div >.MuiDataGrid-cell": {
					// border: ".5px solid rgb(30, 41, 59,  .1)"
					fontSize: "13px",
					color: "#767171",
					fontWeight: 300
				}
			},
			"& .Mui-selected": {
				backgroundColor: "#FFD7D7"
			}
		}
	})
);

export default useStyles;
