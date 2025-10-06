console.dir(localStorage);
var databaseName = 'controleEstoque';
if (localStorage[databaseName]) {
    console.dir(JSON.parse(localStorage[databaseName]));
}
var lsDatabase;
var localStorageFN = function () {
    var _this = this;

    _this.save_on_localStorage = function () {
        localStorage[databaseName] = JSON.stringify(lsDatabase);
    }

    _this.recoverLs_data = function () {
        lsDatabase = localStorage[databaseName];
        if (!localStorage[databaseName]) {
            lsDatabase = {};
        } else {
            lsDatabase = JSON.parse(localStorage[databaseName]);
        }
        lsDatabase = lsDatabase;
    }

    _this.create_table = function (tableName) {
        _this.recoverLs_data();
        lsDatabase[tableName] = [];
        lsDatabase[tableName + '_lastId'] = 0;
        _this.save_on_localStorage(lsDatabase);
    }
}

var _lsobj = new localStorageFN();

function save_ls(table, dataObj) {
    _lsobj.recoverLs_data();
    if (!lsDatabase[table]) {
        _lsobj.create_table(table);
    }
    var atualLsTableData = lsDatabase[table],
        newObject = {};

    var newData = dataObj['id'] == undefined;
    if (newData) {
        newObject['id'] = lsDatabase[table + '_lastId'];
        lsDatabase[table + '_lastId'] += 1;
    }

    Object.keys(dataObj).forEach(function (col, i) {
        var data = dataObj[col];
        newObject[col] = data;
    });

    if (newData) {
        atualLsTableData.push(newObject);
    }
    else {
        atualLsTableData[dataObj['id']] = newObject;
    }

    _lsobj.save_on_localStorage();
}

function getAll_ls() {
    _lsobj.recoverLs_data();
    return lsDatabase;
}

function getTable_ls(table) {
    _lsobj.recoverLs_data();
    var return_table;
    if (!table) {
        return_table = false;
        alert('Informe uma tabela');
    } else {
        return_table = getAll_ls()[table];
    }
    return return_table;
}

function getData_ls(table, id) {
    _lsobj.recoverLs_data();
    var _tableData = getTable_ls(table),
        _returnData = false;

    _tableData.forEach(function (_obj, index) {
        if (_obj.id == id) {
            _returnData = _obj;
        }
    });
    return _returnData;
}

function deleteData_ls(table, id) {
    _lsobj.recoverLs_data();
    var _tableData = getTable_ls(table);

    //lsDatabase[table]
    _tableData.forEach(function (_obj, index) {
        console.dir(_obj);

        if (_obj.id == id) {
            lsDatabase[table].splice(index, 1);
        }
    });
    _lsobj.save_on_localStorage();
}

function clearDatabase_ls() {
    localStorage.clear(databaseName);
}