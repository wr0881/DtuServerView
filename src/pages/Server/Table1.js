/* eslint-disable no-unneeded-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-useless-constructor */
/* eslint-disable react/sort-comp */
/* eslint-disable eqeqeq */
/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable func-names */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-multi-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-console */
import React,{Component} from 'react';
import {Card,Table,Form, Input, Divider, Select, Button} from 'antd';
import data from './data';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { renderDom, record, ...restProps } = this.props;
        return (
            <td>
                <EditableContext.Consumer>
                    {form => {
                        this.form = form;
                        return renderDom(form, record);
                    }}
                </EditableContext.Consumer>
            </td>
        )
    }
}
 
// eslint-disable-next-line react/no-multi-comp
class Table1 extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isRowOpen: false,
            locale: {
                emptyText: '暂无数据'
            },
            data: []
        };

        // 设置表格内容
        this.columns = [
            {
                title: '终端编号',
                width: '30%',
                key: 'terminalNumber',
                dataIndex: 'terminalNumber',
                renderDom: (form, record) => {
                    return record.type !== 'view' ? (
                        <FormItem>
                            {form.getFieldDecorator('terminalNumber',{
                                rules: [{
                                    required:true,
                                    message:'请选择终端编号!'
                                }],
                                initialValue: record.terminalNumber
                            })(
                                <Input />
                                // <Select
                                //     placeholder='终端编号'
                                //     filterOption={false}
                                // >
                                //     {this.state.data.map(v => <Select.Option key={v.terminalNumber}>{v.terminalNumber}</Select.Option>)}
                                // </Select>
                            )}
                        </FormItem>
                    ):(
                        record.terminalNumber
                    )
                }
            },
            {
                title: '终端类型',
                width: '20%',
                key: 'terminalType',
                dataIndex: 'terminalType',
                renderDom: (form, record) => {
                    return record.type !== 'view' ? (
                        <FormItem>
                            {form.getFieldDecorator('terminalType',{
                                rules: [
                                    {
                                        required: true,
                                        message: '终端类型不能为空！'
                                    }
                                ],
                                initialValue: record.terminalType
                            })(
                                // <Input />
                                <Select
                                    style={{width:'100px'}}
                                    placeholder="终端类型"
                                    filterOption={false}
                                >
                                    <Select.Option key='有人DTU'>有人DTU</Select.Option>
                                    <Select.Option key='测智终端'>测智终端</Select.Option>
                                </Select>
                            )}
                        </FormItem>
                    ):(
                        record.terminalType
                    )
                }
            },
            {
                title: '连接状态',
                width: '20%',
                key: 'connectStatus',
                dataIndex: 'connectStatus',
                renderDom: (form, record) => {
                    return record.type !== 'view' ? (
                        <FormItem>
                            {form.getFieldDecorator('connectStatus',{
                                rules: [
                                    {
                                        required: true,
                                        message: '连接状态不能为空！'
                                    }
                                ],
                                initialValue: record.connectStatus
                            })(
                                // <Input />
                                <Select
                                    style={{width:'100px'}}
                                    placeholder='连接状态'
                                    filterOption={false}
                                >
                                    <Select.Option key='上线'>上线</Select.Option>
                                    <Select.Option key='离线'>离线</Select.Option>
                                </Select>
                            )}
                        </FormItem>
                    ):(
                        record.connectStatus
                    )
                }
            },
            {
                title: '操作',
                width: '30%',
                renderDom: (form, record) => (
                    <span>
                        {record.type === 'new' && ( // 新增
                            <span>
                                <a href='javascript:;' onClick={e => this.addSubmit(form, record)}>
                                    完成
                                </a>
                                <Divider type='vertical' />
                                <a href='javascript:;' onClick={e => this.removeAdd(record)}>
                                    取消
                                </a>
                            </span>
                        )}
                        {record.type === 'edit' && ( // 编辑状态
                            <span>
                                <a href='javascript:;' onClick={e => this.editSubmit(form, record)}>
                                    完成
                                </a>
                                <Divider type='vertical' />
                                <a href='javascript:;' onClick={e => this.giveUpUpdata(record)}>
                                    取消
                                </a>
                                <Divider type='vertical' />
                                <a href='javascript:;' onClick={e => this.delete(record)}>
                                    删除
                                </a>
                            </span>
                        )}
                        {record.type === 'view' && ( // 初始状态
                            <span>
                                <a href='javascript:;' onClick={e => this.edit(record)}>
                                    编辑
                                </a>
                                <Divider type='vertical' />
                                <a href='javascript:;' onClick={e => this.delete(record)}>
                                    删除
                                </a>
                            </span>
                        )}
                    </span>
                )
            }
        ]
    }
    
    // 初始化table表格
    componentDidMount() {
        this.initRowType(data.getList);
    }

    initRowType(data) {
        for(let item of data){
            item['type'] = 'view';
        }
        this.updateDataSource(data);
    }

    updateDataSource(newData, isAddDisabled) {
        let isRowOpen =
            typeof isAddDisabled == 'boolean'
            ? isAddDisabled
            : newData.some(item => item.type === "new" || item.type === "edit");
        this.setState({
            isRowOpen,
            data: newData
        });
    }

    // 新增数据(已实现)
    addRow = () => {
        let { data } = this.state;
        let newRecord = {
            terminalNumber: '',
            terminalType: '',
            connectStatus: '',
            type: 'new',
            id: '',
            key: ''
        }
        data.push(newRecord);
        this.updateDataSource(data);
        console.log('添加行！！！');
    }
    
    // 添加行，填入终端编号，选择终端类型和连接状态点击完成添加成功(已实现)
    addSubmit(form, record) {
        let { data } = this.state;
    
        form.validateFields((error, values) => {
            if (error) {
                return;
            }
            values.existence = values.existence == "1" ? true : false;
            let updateData = { ...record, ...values };
        
            setTimeout(res => {
                updateData.type = "view";
                data.pop();
                data.push(updateData);
                this.updateDataSource(data);
                // notification["success"]({ message: "添加成功！" });
                console.log('添加成功!');
            }, 500);
        });
    }

    // 完成编辑，对某行已有内容完成编辑提交(已实现)
    editSubmit(form, record) {
        let { data } = this.state;

        form.validateFields((error, values) => {
            if (error) {
                return;
            }
            values.existence= values.existence == "1" ? true : false;
            let updateData = { ...record, ...values };

            // console.log(updateData);
            setTimeout(res => {
            // 将updateData更新到dataSource
            let newData = data.map(item => {
                if (item.id === updateData.id) {
                    item = Object.assign({}, updateData);
                    item.type = "view";
                }
                return item;
            });
            this.updateDataSource(newData);
            // notification["success"]({ message: "修改成功！" });
            console.log('修改成功!');
            });
        });
    }

    // 取消新增内容(已实现)
    removeAdd(record) {
        let { data } = this.state;
        data.pop();
        this.updateDataSource(data);
    }

    // 取消编辑(已实现)
    giveUpUpdata(record) {
        let { data } = this.state;
        let editRow = data.find(item => item.id === record.id);
        editRow.type = "view";
        this.updateDataSource(data);
    }

    // 删除行，删除相关内容(已实现)
    delete(record) {
        let { data } = this.state;
        // console.log(record);
        setTimeout(res => {
            let index = data.findIndex(item => item.id === record.id);
            data.splice(index, 1);
            this.updateDataSource(data);
            console.log('删除成功!');
        });
    }

    // 编辑行，对某行内容进行重新编辑(已实现)
    edit(record) {
        console.log('开始编辑...');
        let { data } = this.state;
        let newData = data.filter(item => {
            console.log(record.id);
            if (item.id === record.id) { 
                item.type = "edit";
                return item;
            } else if (item.type !== "new") {
                item.type = "view";
                return item;
            }
        });
        this.updateDataSource(newData, true);
    }
    render() {
        const { data, locale, isRowOpen } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        };
        const columns = this.columns.map(col => {
            return {
                ...col,
                onCell: record => ({
                    ...col,
                    record
                })
            };
        });
        return (
        <Card>
            <Button
                style={{ marginBottom: '10px' }}
                disabled={isRowOpen}
                onClick={this.addRow}
            >
                + 添加
            </Button>
            <Table 
                components={components}
                columns={columns}
                dataSource={data}
            />
        </Card>
        )
    }
}
 
export default Table1;
// ReactDOM.render(<Table1 />, document.getElementById("container"));